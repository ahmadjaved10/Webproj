const InventoryLog = require('../models/InventoryLog');

// Add a new inventory log
exports.addInventoryLog = async (req, res, next) => {
    try {
        const log = new InventoryLog({ ...req.body, supplierId: req.user._id });
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        next(error);
    }
};

// Get all inventory logs for a supplier
exports.getInventoryLogs = async (req, res, next) => {
    try {
        const logs = await InventoryLog.find({ supplierId: req.user._id });
        res.status(200).json(logs);
    } catch (error) {
        next(error);
    }
};

// Get an inventory log by ID
exports.getInventoryLogById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const log = await InventoryLog.findById(id);
        if (!log) return res.status(404).json({ message: 'Inventory log not found' });
        res.status(200).json(log);
    } catch (error) {
        next(error);
    }
};

// Update an inventory log
exports.updateInventoryLog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedLog = await InventoryLog.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedLog) return res.status(404).json({ message: 'Inventory log not found' });
        res.status(200).json(updatedLog);
    } catch (error) {
        next(error);
    }
};

// Delete an inventory log
exports.deleteInventoryLog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedLog = await InventoryLog.findByIdAndDelete(id);
        if (!deletedLog) return res.status(404).json({ message: 'Inventory log not found' });
        res.status(200).json({ message: 'Inventory log deleted successfully' });
    } catch (error) {
        next(error);
    }
};