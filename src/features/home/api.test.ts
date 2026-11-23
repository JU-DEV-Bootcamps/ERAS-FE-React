import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ApiError } from '../../core/http/api-error';
import { createHttpClient } from '../../core/http/http';
import { getDashboardKpis, getUserConfigurations } from './api';

const server = setupServer();
const client = createHttpClient({
  getToken: () => Promise.resolve('test-token'),
  login: () => Promise.resolve(),
});
const signal = new AbortController().signal;

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe('Home API (design D9)', () => {
  it('rejects a KPI response with a missing field', async () => {
    server.use(
      http.get('*/api/v1/dashboard/kpis', () =>
        HttpResponse.json({
          success: true,
          body: {
            totalStudents: { value: 120, percentageChange: 12.5 },
            totalPollsAnswered: { value: 340 },
            totalEvaluations: { value: 45, percentageChange: 0 },
          },
        })
      )
    );

    const failure: unknown = await getDashboardKpis(client, signal).catch(
      (error: unknown) => error
    );
    expect(failure).toBeInstanceOf(ApiError);
    expect(failure).toMatchObject({ status: 0 });
  });

  it('drops the URL and the key of a configuration', async () => {
    server.use(
      http.get('*/api/v1/configurations/user-1', () =>
        HttpResponse.json([
          {
            id: 1,
            userId: 'user-1',
            configurationName: 'Main',
            baseURL: 'https://cosmic-latte.example',
            encryptedKey: 'not-a-real-key',
            serviceProviderId: 7,
            isDeleted: false,
            audit: { createdBy: 'Maria Lopez', modifiedBy: 'Maria Lopez' },
          },
        ])
      )
    );

    const configurations = await getUserConfigurations(
      client,
      'user-1',
      signal
    );

    expect(configurations).toEqual([
      {
        id: 1,
        configurationName: 'Main',
        serviceProviderId: 7,
        audit: { createdBy: 'Maria Lopez' },
      },
    ]);
    expect(JSON.stringify(configurations)).not.toContain('not-a-real-key');
    expect(JSON.stringify(configurations)).not.toContain(
      'cosmic-latte.example'
    );
  });
});
