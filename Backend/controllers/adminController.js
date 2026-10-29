const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const CustomerOrder = require('../models/CustomerOrder');
const InventoryLog = require('../models/InventoryLog');
const Notification = require('../models/Notification');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Promotion = require('../models/Promotion');
const SupportTicket = require('../models/SupportTicket');
const { updateCustomerOrderStatus } = require('../utils/customerOrderStatus');

exports.login = async (req, res, next) => {
    try {
        const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        const password = req.body.password;
        if (!email || typeof password !== 'string') {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = require('jsonwebtoken').sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );
        res.json({
            token,
            role: 'admin',
            admin: { id: admin._id, name: admin.name, email: admin.email },
        });
    } catch (error) {
        next(error);
    }
};

exports.getSummary = async (req, res, next) => {
    try {
        const [suppliers, pendingSuppliers, customers, products, orders, openTickets] = await Promise.all([
            Supplier.countDocuments(),
            Supplier.countDocuments({ approvalStatus: 'Pending' }),
            Customer.countDocuments(),
            Product.countDocuments(),
            CustomerOrder.countDocuments(),
            SupportTicket.countDocuments({ status: { $ne: 'Resolved' } }),
        ]);
        res.json({ suppliers, pendingSuppliers, customers, products, orders, openTickets });
    } catch (error) {
        next(error);
    }
};

exports.getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Supplier.find()
            .select('name email phone address approvalStatus businessVerification.isVerified createdAt')
            .sort({ createdAt: -1 })
            .lean();
        res.json({
            suppliers: suppliers.map((supplier) => ({
                ...supplier,
                approvalStatus: supplier.approvalStatus || 'Approved',
            })),
        });
    } catch (error) {
        next(error);
    }
};

exports.getCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.find()
            .select('name email phone createdAt')
            .sort({ createdAt: -1 })
            .lean();
        res.json({ customers });
    } catch (error) {
        next(error);
    }
};

exports.updateSupplierApproval = async (req, res, next) => {
    try {
        const { approvalStatus } = req.body;
        if (!['Approved', 'Rejected'].includes(approvalStatus)) {
            return res.status(400).json({ message: 'Supplier approval must be Approved or Rejected.' });
        }
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { approvalStatus },
            { new: true, runValidators: true }
        ).select('name email approvalStatus');
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }
        res.json({ supplier });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid supplier ID.' });
        }
        next(error);
    }
};

exports.deleteSupplier = async (req, res, next) => {
    try {
        if (req.body.confirmation !== 'confirm') {
            return res.status(400).json({ message: 'Type confirm to permanently delete this supplier.' });
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid supplier ID.' });
        }

        const supplier = await Supplier.findById(req.params.id).select('name');
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }
        const [activeCustomerOrder, activeSupplierOrder] = await Promise.all([
            CustomerOrder.exists({
                'items.supplierId': supplier._id,
                status: { $nin: ['Completed', 'Cancelled'] },
            }),
            Order.exists({
                supplierId: supplier._id,
                orderStatus: { $nin: ['Completed', 'Cancelled'] },
            }),
        ]);
        if (activeCustomerOrder || activeSupplierOrder) {
            return res.status(409).json({
                message: 'Complete or cancel this supplier’s active orders before deleting the account.',
            });
        }

        const products = await Product.find({ supplierId: supplier._id }).select('_id').lean();
        const productIds = products.map((product) => product._id);
        await Promise.all([
            Product.deleteMany({ supplierId: supplier._id }),
            Promotion.deleteMany({ supplierId: supplier._id }),
            InventoryLog.deleteMany({ supplierId: supplier._id }),
            Notification.deleteMany({ supplierId: supplier._id }),
            Order.deleteMany({ supplierId: supplier._id }),
            SupportTicket.deleteMany({ supplierId: supplier._id }),
            Promotion.deleteMany({ products: { $in: productIds } }),
        ]);
        await supplier.deleteOne();
        res.json({ message: 'Supplier and supplier-managed records permanently deleted.' });
    } catch (error) {
        next(error);
    }
};

exports.deleteCustomer = async (req, res, next) => {
    try {
        if (req.body.confirmation !== 'confirm') {
            return res.status(400).json({ message: 'Type confirm to permanently delete this customer.' });
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid customer ID.' });
        }
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        await CustomerOrder.deleteMany({ customerId: customer._id });
        await customer.deleteOne();
        res.json({ message: 'Customer and customer order history permanently deleted.' });
    } catch (error) {
        next(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await CustomerOrder.find()
            .populate('customerId', 'name email phone')
            .sort({ createdAt: -1 })
            .lean();
        res.json({ orders });
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID.' });
        }

        const order = await CustomerOrder.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        await updateCustomerOrderStatus(order, req.body.status);
        res.json({ order });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        next(error);
    }
};

exports.getSupportTickets = async (req, res, next) => {
    try {
        const tickets = await SupportTicket.find()
            .populate('supplierId', 'name email')
            .sort({ createdAt: -1 })
            .lean();
        res.json({ tickets });
    } catch (error) {
        next(error);
    }
};

exports.updateSupportTicketStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['Open', 'In Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid support ticket status.' });
        }
        const ticket = await SupportTicket.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('supplierId', 'name email');
        if (!ticket) {
            return res.status(404).json({ message: 'Support ticket not found.' });
        }
        res.json({ ticket });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid support ticket ID.' });
        }
        next(error);
    }
};
