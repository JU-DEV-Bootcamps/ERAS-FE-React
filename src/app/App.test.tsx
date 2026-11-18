import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { initI18n } from '../core/i18n/i18n';
import { App } from './App';

const roleNames = {
  administrator: 'ERAS Administrator',
  officer: 'ERAS Student Services Officer',
  professional: 'ERAS Professional',
};

describe('App', () => {
  it('shows the home of the shell to a signed-in user and lets them log out', async () => {
    const logout = vi.fn(() => Promise.resolve());
    render(<App i18n={await initI18n()} session={{ roles: ['ERAS Professional'], roleNames, logout }} />);

    expect(await screen.findByText('You are signed in.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Log out' }));
    expect(logout).toHaveBeenCalledOnce();
  });
});
