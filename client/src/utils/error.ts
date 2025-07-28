import { MESSAGES } from '@/constants';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 401:
        return MESSAGES.ERROR.UNAUTHORIZED;
      case 404:
        return MESSAGES.ERROR.NOT_FOUND;
      case 500:
      case 502:
      case 503:
        return MESSAGES.ERROR.SERVER;
      default:
        return error.message || MESSAGES.ERROR.NETWORK;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return MESSAGES.ERROR.NETWORK;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}