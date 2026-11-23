// The HTTP client of ERAS v3. It calls the backend on the app's own origin under /api/v1 (AGENTS.md section 4.3):
// in development the Vite server proxies /api to the backend, in Stage and production the v3 web server does.
import axios, { isAxiosError, type AxiosInstance } from 'axios';

import type { Auth } from '../auth/auth';
import { toApiError } from './api-error';

export const API_BASE_URL = '/api/v1';
/** The HTTP client the screens receive; features name it with this type, never with axios. */
export type HttpClient = AxiosInstance;
/** Milliseconds a request may take before it fails (ADR-0014). */
export const HTTP_TIMEOUT_MS = 30_000;

/** The one axios instance of ERAS v3; every failure it rejects with is an ApiError. */
export function createHttpClient(
  auth: Pick<Auth, 'getToken' | 'login'>
): HttpClient {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: HTTP_TIMEOUT_MS,
  });

  client.interceptors.request.use(async request => {
    request.headers.set('Authorization', `Bearer ${await auth.getToken()}`);
    return request;
  });

  client.interceptors.response.use(undefined, async (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      await auth.login();
    }
    throw toApiError(error);
  });

  return client;
}
