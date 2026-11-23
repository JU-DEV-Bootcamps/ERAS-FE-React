// How the screens reach the one HTTP client (ADR-0015): main.tsx creates it, AppProviders mounts this provider,
// and the hooks of each feature read it with useHttpClient(). Tests pass their own client the same way.
import { createContext, useContext, type ReactNode } from 'react';

import type { HttpClient } from './http';

const HttpClientContext = createContext<HttpClient | null>(null);

interface HttpClientProviderProps {
  client: HttpClient;
  children: ReactNode;
}

export function HttpClientProvider({
  client,
  children,
}: HttpClientProviderProps) {
  return <HttpClientContext value={client}>{children}</HttpClientContext>;
}

export function useHttpClient(): HttpClient {
  const client = useContext(HttpClientContext);
  if (!client) {
    throw new Error('useHttpClient must be used inside an HttpClientProvider');
  }
  return client;
}
