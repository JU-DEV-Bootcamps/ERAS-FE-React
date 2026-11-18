// The HTTP client of ERAS v3. It calls the backend on the app's own origin under /api/v1 (AGENTS.md section 4.3):
// in development the Vite server proxies /api to the backend, in Stage and production the v3 web server does.
import axios, { isAxiosError, type AxiosInstance } from 'axios';

import type { Auth } from '../auth/auth';

export const API_BASE_URL = '/api/v1';

export function createHttpClient(auth: Pick<Auth, 'getToken' | 'login'>): AxiosInstance {
  const client = axios.create({ baseURL: API_BASE_URL });

  client.interceptors.request.use(async (request) => {
    request.headers.set('Authorization', `Bearer ${await auth.getToken()}`);
    return request;
  });

  client.interceptors.response.use(undefined, async (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      await auth.login();
    }
    throw error;
  });

  return client;
}
