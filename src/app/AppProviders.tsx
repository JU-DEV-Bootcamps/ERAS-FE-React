import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { i18n } from 'i18next';
import { useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

interface AppProvidersProps {
  i18n: i18n;
  children: ReactNode;
}

/** The providers every screen needs: translations and server state (TanStack Query). */
export function AppProviders({ i18n, children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nextProvider>
  );
}
