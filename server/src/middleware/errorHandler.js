"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
/**
 * Custom application error class.
 * Extends Error with an HTTP status code for proper error responses.
 */
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns a structured JSON response.
 * Distinguishes between known AppErrors and unexpected errors.
 */
const errorHandler = (err, _req, res, _next) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message,
        });
        return;
    }
    // Unexpected errors
    res.status(500).json({
        error: 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
