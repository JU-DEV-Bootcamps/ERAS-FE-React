import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { ApiError, toApiError } from './api-error';

function axiosErrorWith(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError('Request failed', 'ERR_BAD_RESPONSE', config, null, {
    status,
    statusText: '',
    headers: {},
    config,
    data,
  });
}

describe('toApiError', () => {
  it('reads the error middleware shape and drops its stack trace', () => {
    const error = toApiError(
      axiosErrorWith(500, {
        statusCode: 500,
        message: 'Something failed',
        detailed: 'at Eras.Api.Controllers…',
      })
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(500);
    expect(error.message).toBe('Something failed');
    expect(error.validationErrors).toEqual([]);
    expect(JSON.stringify(error)).not.toContain('Eras.Api.Controllers');
    expect(Object.values(error)).not.toContain('at Eras.Api.Controllers…');
  });

  it('reads the BaseResponse shape with its validation errors', () => {
    const error = toApiError(
      axiosErrorWith(400, {
        success: false,
        message: 'Invalid request',
        validationErrors: ['Name is required.'],
      })
    );

    expect(error.status).toBe(400);
    expect(error.message).toBe('Invalid request');
    expect(error.validationErrors).toEqual(['Name is required.']);
  });

  it('gives a generic message when the body has none', () => {
    const error = toApiError(axiosErrorWith(403, 'Forbidden'));
    expect(error.status).toBe(403);
    expect(error.message).toBe('The request failed');
  });

  it('reports a timeout or a network failure with status 0', () => {
    const timeout = new AxiosError(
      'timeout of 30000ms exceeded',
      'ECONNABORTED'
    );
    expect(toApiError(timeout).status).toBe(0);
    expect(toApiError(new Error('boom')).status).toBe(0);
  });

  it('returns an ApiError unchanged', () => {
    const original = new ApiError(404, 'Not found', []);
    expect(toApiError(original)).toBe(original);
  });
});
