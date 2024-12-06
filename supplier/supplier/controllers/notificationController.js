const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ supplierId: req.user._id });
        res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.status(200).json(notification);
    } catch (error) {
        next(error);
    }
};

exports.createNotification = async (req, res, next) => {
    try {
        const { type, message } = req.body;

        // Create a new notification linked to the authenticated supplier
        const notification = new Notification({
            supplierId: req.user._id,
            type,
            message,
        });

        // Save the notification to the database
        const savedNotification = await notification.save();
        res.status(201).json(savedNotification);
    } catch (error) {
        next(error);
    }
};
