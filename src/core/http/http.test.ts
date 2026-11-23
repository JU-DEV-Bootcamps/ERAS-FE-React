import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ApiError } from './api-error';
import { createHttpClient, HTTP_TIMEOUT_MS } from './http';

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

function fakeAuth(token = 'the-token') {
  return {
    getToken: vi.fn(() => Promise.resolve(token)),
    login: vi.fn(() => Promise.resolve()),
  };
}

describe('createHttpClient', () => {
  it('calls the API under /api/v1 on the same origin', async () => {
    let path = '';
    server.use(
      http.get('*/api/v1/feature-flags', ({ request }) => {
        path = new URL(request.url).pathname;
        return HttpResponse.json([]);
      })
    );
    await createHttpClient(fakeAuth()).get('/feature-flags');
    expect(path).toBe('/api/v1/feature-flags');
  });

  it('sends the access token as a bearer token', async () => {
    let authorization: string | null = null;
    server.use(
      http.get('*/api/v1/feature-flags', ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json([]);
      })
    );
    await createHttpClient(fakeAuth('abc')).get('/feature-flags');
    expect(authorization).toBe('Bearer abc');
  });

  it('asks for a new login when the API answers 401', async () => {
    server.use(
      http.get(
        '*/api/v1/feature-flags',
        () => new HttpResponse(null, { status: 401 })
      )
    );
    const auth = fakeAuth();
    await expect(
      createHttpClient(auth).get('/feature-flags')
    ).rejects.toThrow();
    expect(auth.login).toHaveBeenCalledOnce();
  });

  it('gives up on a request after the default timeout', () => {
    expect(HTTP_TIMEOUT_MS).toBe(30_000);
    expect(createHttpClient(fakeAuth()).defaults.timeout).toBe(HTTP_TIMEOUT_MS);
  });

  it('rejects a failed request with an ApiError', async () => {
    server.use(
      http.get('*/api/v1/feature-flags', () =>
        HttpResponse.json(
          { statusCode: 500, message: 'Something failed', detailed: 'trace' },
          { status: 500 }
        )
      )
    );
    const failure: unknown = await createHttpClient(fakeAuth())
      .get('/feature-flags')
      .catch((error: unknown) => error);
    expect(failure).toBeInstanceOf(ApiError);
    expect(failure).toMatchObject({ status: 500, message: 'Something failed' });
  });

  it('does not log in again for other errors', async () => {
    server.use(
      http.get(
        '*/api/v1/feature-flags',
        () => new HttpResponse(null, { status: 403 })
      )
    );
    const auth = fakeAuth();
    await expect(
      createHttpClient(auth).get('/feature-flags')
    ).rejects.toThrow();
    expect(auth.login).not.toHaveBeenCalled();
  });
});
