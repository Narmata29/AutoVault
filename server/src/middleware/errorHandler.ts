import { Request, Response, NextFunction } from 'express';

/**
 * Custom application error class.
 * Extends Error with an HTTP status code for proper error responses.
 */
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns a structured JSON response.
 * Distinguishes between known AppErrors and unexpected errors.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
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
