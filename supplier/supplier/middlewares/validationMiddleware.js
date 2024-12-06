const { validationResult } = require('express-validator');

exports.validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    // If validation fails, return a 400 response with the errors
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    // Proceed to the next middleware or controller if validation passes
    next();
};
