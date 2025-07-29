import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.name,
        message: err.message,
      },
    });
    return;
  }

  logger.error('Unexpected error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong' 
        : err.message,
    },
  });
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
};