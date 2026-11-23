// The one error type of every backend call (ADR-0014). It reads both error shapes of the backend, the error
// middleware's { statusCode, message, detailed } and BaseResponse { success, message, validationErrors },
// and never keeps `detailed` (a stack trace) or the raw body.
import { isAxiosError } from 'axios';

const GENERIC_MESSAGE = 'The request failed';

export class ApiError extends Error {
  /** The HTTP status, or 0 when no response arrived (timeout, network failure, invalid response). */
  readonly status: number;
  readonly validationErrors: readonly string[];

  constructor(
    status: number,
    message: string,
    validationErrors: readonly string[]
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

function field(body: unknown, key: string): unknown {
  return body !== null && typeof body === 'object'
    ? (body as Record<string, unknown>)[key]
    : undefined;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (!isAxiosError(error) || !error.response) {
    return new ApiError(0, GENERIC_MESSAGE, []);
  }
  const body: unknown = error.response.data;
  const message = field(body, 'message');
  const validationErrors = field(body, 'validationErrors');
  return new ApiError(
    error.response.status,
    typeof message === 'string' && message !== '' ? message : GENERIC_MESSAGE,
    Array.isArray(validationErrors)
      ? validationErrors.filter(
          (item): item is string => typeof item === 'string'
        )
      : []
  );
}
