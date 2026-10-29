const Product = require('../models/Product');

const ORDER_TRANSITIONS = {
    Placed: ['Accepted', 'Cancelled'],
    Accepted: ['Preparing', 'Cancelled'],
    Preparing: ['Ready', 'Cancelled'],
    Ready: ['Completed', 'Cancelled'],
    Completed: [],
    Cancelled: [],
};

const createRequestError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

const updateCustomerOrderStatus = async (order, status) => {
    if (!Object.hasOwn(ORDER_TRANSITIONS, order.status) ||
        !ORDER_TRANSITIONS[order.status].includes(status)) {
        throw createRequestError(400, `Order cannot move from ${order.status} to ${status}.`);
    }

    const stockChanges = [];
    try {
        if (status === 'Accepted' && !order.stockDeducted) {
            for (const item of order.items) {
                const product = await Product.findOneAndUpdate(
                    {
                        _id: item.productId,
                        supplierId: item.supplierId,
                        status: 'Active',
                        stock: { $gte: item.quantity },
                    },
                    { $inc: { stock: -item.quantity } },
                    { new: true }
                );
                if (!product) {
                    throw createRequestError(409, `Not enough stock to accept ${item.productName}.`);
                }
                stockChanges.push({
                    productId: item.productId,
                    supplierId: item.supplierId,
                    delta: -item.quantity,
                });
            }
            order.stockDeducted = true;
        }

        if (status === 'Cancelled' && order.stockDeducted) {
            for (const item of order.items) {
                const result = await Product.updateOne(
                    { _id: item.productId, supplierId: item.supplierId },
                    { $inc: { stock: item.quantity } }
                );
                if (result.matchedCount !== 1) {
                    throw createRequestError(409, `Could not restore stock for ${item.productName}.`);
                }
                stockChanges.push({
                    productId: item.productId,
                    supplierId: item.supplierId,
                    delta: item.quantity,
                });
            }
            order.stockDeducted = false;
        }

        order.status = status;
        await order.save();
        return order;
    } catch (error) {
        for (const change of stockChanges.reverse()) {
            try {
                await Product.updateOne(
                    { _id: change.productId, supplierId: change.supplierId },
                    { $inc: { stock: -change.delta } }
                );
            } catch (rollbackError) {
                console.error('Failed to roll back customer order stock update.', rollbackError);
            }
        }
        throw error;
    }
};

module.exports = { updateCustomerOrderStatus };
