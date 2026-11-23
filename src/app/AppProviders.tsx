import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { i18n } from 'i18next';
import { useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import type { HttpClient } from '../core/http/http';
import { HttpClientProvider } from '../core/http/http-client-context';
import { theme } from './theme';

interface AppProvidersProps {
  i18n: i18n;
  httpClient: HttpClient;
  /** Tests pass a client without retries; the app creates its own. */
  queryClient?: QueryClient;
  children: ReactNode;
}

/** The providers every screen needs: translations, the HTTP client, server state (TanStack Query) and the theme. */
export function AppProviders({
  i18n,
  httpClient,
  queryClient,
  children,
}: AppProvidersProps) {
  const [client] = useState(() => queryClient ?? new QueryClient());
  return (
    <I18nextProvider i18n={i18n}>
      <HttpClientProvider client={httpClient}>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </HttpClientProvider>
    </I18nextProvider>
  );
}
