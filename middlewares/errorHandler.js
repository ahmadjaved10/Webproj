exports.errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error (you could use a logger like Winston or Morgan)
    console.error(err);

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
    });
};
