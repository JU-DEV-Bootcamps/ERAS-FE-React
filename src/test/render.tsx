// Renders the real route table of v3 inside every provider of the app, for screen tests. HTTP goes to MSW;
// the query client never retries, so a failed request shows its error at once.
import { QueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';

import { AppProviders } from '../app/AppProviders';
import { appRoutes, buildRouteObjects } from '../app/routing/routes';
import { SessionProvider, type Session } from '../app/session';
import { createHttpClient } from '../core/http/http';
import { initI18n } from '../core/i18n/i18n';

export const roleNames = {
  administrator: 'ERAS Administrator',
  officer: 'ERAS Student Services Officer',
  professional: 'ERAS Professional',
};

interface RenderOptions {
  /** The Keycloak role names of the user; an empty list is a Guest. */
  roles: readonly string[];
  path?: string;
  userId?: string;
  /** The name shown in the header and the user menu. */
  userName?: string;
  /** The session's logout; a test passes a spy to see it run. */
  logout?: () => Promise<void>;
}

export async function renderWithProviders({
  roles,
  path = '/',
  userId = 'user-1',
  userName = 'Test User',
  logout = () => Promise.resolve(),
}: RenderOptions) {
  const session: Session = {
    userId,
    userName,
    roles,
    roleNames,
    logout,
  };
  const httpClient = createHttpClient({
    getToken: () => Promise.resolve('test-token'),
    login: () => Promise.resolve(),
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = createMemoryRouter(buildRouteObjects(appRoutes), {
    initialEntries: [path],
  });
  const i18n = await initI18n();
  const result = render(
    <AppProviders i18n={i18n} httpClient={httpClient} queryClient={queryClient}>
      <SessionProvider session={session}>
        <RouterProvider router={router} />
      </SessionProvider>
    </AppProviders>
  );
  // The router lets a test read the current address (router.state.location.pathname).
  return { ...result, router };
}
