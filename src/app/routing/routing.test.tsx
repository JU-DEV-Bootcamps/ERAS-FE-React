import { render, screen } from '@testing-library/react';
import type { i18n } from 'i18next';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeAll, describe, expect, it } from 'vitest';

import { createHttpClient } from '../../core/http/http';
import { initI18n } from '../../core/i18n/i18n';
import { AppProviders } from '../AppProviders';
import { SessionProvider, type Session } from '../session';
import { buildRouteObjects, type AppRoute } from './routes';

const roleNames = {
  administrator: 'ERAS Administrator',
  officer: 'ERAS Student Services Officer',
  professional: 'ERAS Professional',
};

const testRoutes: AppRoute[] = [
  { path: '/', element: <p>open page</p>, roles: [] },
  { path: '/officers', element: <p>officer page</p>, roles: ['officer'] },
];

let translations: i18n;
beforeAll(async () => {
  translations = await initI18n();
});

function renderAt(path: string, roles: string[]) {
  const session: Session = {
    userId: 'user-1',
    userName: 'Test User',
    roles,
    roleNames,
    logout: () => Promise.resolve(),
  };
  const router = createMemoryRouter(buildRouteObjects(testRoutes), {
    initialEntries: [path],
  });
  render(
    <AppProviders
      i18n={translations}
      httpClient={createHttpClient({
        getToken: () => Promise.resolve('token'),
        login: () => Promise.resolve(),
      })}
    >
      <SessionProvider session={session}>
        <RouterProvider router={router} />
      </SessionProvider>
    </AppProviders>
  );
}

describe('route table and role guard', () => {
  it('opens a route without roles to any authenticated user', async () => {
    renderAt('/', []);
    expect(await screen.findByText('open page')).toBeInTheDocument();
  });

  it('sends a user without the required role to "access denied"', async () => {
    renderAt('/officers', ['ERAS Professional']);
    expect(
      await screen.findByRole('heading', { name: 'Access denied' })
    ).toBeInTheDocument();
    expect(screen.queryByText('officer page')).not.toBeInTheDocument();
  });

  it('opens a route to a user with the required role', async () => {
    renderAt('/officers', ['ERAS Student Services Officer']);
    expect(await screen.findByText('officer page')).toBeInTheDocument();
  });

  it('lets the Administrator open every route', async () => {
    renderAt('/officers', ['ERAS Administrator']);
    expect(await screen.findByText('officer page')).toBeInTheDocument();
  });

  it('shows "not found" for an unknown path', async () => {
    renderAt('/no-such-page', ['ERAS Administrator']);
    expect(
      await screen.findByRole('heading', { name: 'Page not found' })
    ).toBeInTheDocument();
  });
});
