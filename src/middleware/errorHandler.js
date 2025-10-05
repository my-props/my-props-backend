const errorLogService = require('../services/errorLogService');

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log the error
    console.error('Error occurred:', err);

    // Log to database
    errorLogService.logRouteError(err, 'errorHandler.js', {
        route: req.originalUrl,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params
    });

    // Default error response
    let statusCode = 500;
    let message = 'Internal Server Error';
    let details = null;

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        details = err.message;
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    } else if (err.name === 'ForbiddenError') {
        statusCode = 403;
        message = 'Forbidden';
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        message = 'Not Found';
    } else if (err.name === 'ConflictError') {
        statusCode = 409;
        message = 'Conflict';
    } else if (err.name === 'DatabaseError') {
        statusCode = 500;
        message = 'Database Error';
    } else if (err.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'Service Unavailable';
    }

    // Send error response
    const errorResponse = {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    };

    // Add details in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.details = details || err.message;
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString()
    });
};

/**
 * Async error wrapper for route handlers
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler
};
