import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { createHttpClient } from '../core/http/http';
import { initI18n } from '../core/i18n/i18n';
import { homeHandlers } from '../features/home/test-handlers';
import { App } from './App';

const server = setupServer(...homeHandlers);
beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
});
afterAll(() => {
  server.close();
});

const roleNames = {
  administrator: 'ERAS Administrator',
  officer: 'ERAS Student Services Officer',
  professional: 'ERAS Professional',
};

describe('App', () => {
  it('opens Home for a signed-in user and lets them log out', async () => {
    const logout = vi.fn(() => Promise.resolve());
    render(
      <App
        i18n={await initI18n()}
        session={{
          userId: 'user-1',
          userName: 'Test User',
          roles: ['ERAS Professional'],
          roleNames,
          logout,
        }}
        httpClient={createHttpClient({
          getToken: () => Promise.resolve('token'),
          login: () => Promise.resolve(),
        })}
      />
    );

    expect(
      await screen.findByRole('heading', { name: 'Overview' })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'User menu' }));
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Log out' })
    );
    expect(logout).toHaveBeenCalledOnce();
  });
});
