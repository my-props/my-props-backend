/**
 * Base custom error class
 */
class CustomError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation Error
 */
class ValidationError extends CustomError {
    constructor(message = 'Validation failed', details = null) {
        super(message, 400);
        this.name = 'ValidationError';
        this.details = details;
    }
}

/**
 * Database Error
 */
class DatabaseError extends CustomError {
    constructor(message = 'Database operation failed', originalError = null) {
        super(message, 500);
        this.name = 'DatabaseError';
        this.originalError = originalError;
    }
}

/**
 * Not Found Error
 */
class NotFoundError extends CustomError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

/**
 * Unauthorized Error
 */
class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

/**
 * Forbidden Error
 */
class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden access') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

/**
 * Conflict Error
 */
class ConflictError extends CustomError {
    constructor(message = 'Resource conflict') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

/**
 * Service Unavailable Error
 */
class ServiceUnavailableError extends CustomError {
    constructor(message = 'Service temporarily unavailable') {
        super(message, 503);
        this.name = 'ServiceUnavailableError';
    }
}

module.exports = {
    CustomError,
    ValidationError,
    DatabaseError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    ServiceUnavailableError
};
