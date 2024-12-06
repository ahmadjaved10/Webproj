const InventoryLog = require('../models/InventoryLog');

exports.addInventoryLog = async (req, res, next) => {
    try {
        const log = new InventoryLog({ ...req.body, supplierId: req.user._id });
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        next(error);
    }
};

exports.getInventoryLogs = async (req, res, next) => {
    try {
        const logs = await InventoryLog.find({ supplierId: req.user._id });
        res.status(200).json(logs);
    } catch (error) {
        next(error);
    }
};
