import {
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { homeHandlers } from '../../features/home/test-handlers';
import { setViewportWidth } from '../../test/media';
import { renderWithProviders } from '../../test/render';

const server = setupServer(...homeHandlers);

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
});
afterEach(() => {
  server.resetHandlers();
  vi.unstubAllGlobals();
});
afterAll(() => {
  server.close();
});

function sideMenu() {
  return screen.findByRole('navigation', { name: 'Main menu' });
}

describe('AppShell', () => {
  it('[0010-add-v3-shell/AC-1] shows the logo and only the Home entry to an Officer', async () => {
    setViewportWidth(1280);
    await renderWithProviders({
      roles: ['ERAS Student Services Officer'],
      path: '/home',
    });

    const menu = await sideMenu();
    expect(within(menu).getByRole('img', { name: 'ERAS' })).toBeInTheDocument();
    expect(
      within(menu).getByRole('link', { name: 'Home' })
    ).toBeInTheDocument();
    expect(
      within(menu).queryByRole('link', { name: 'Students' })
    ).not.toBeInTheDocument();
    expect(
      within(menu).queryByRole('link', { name: 'Reports' })
    ).not.toBeInTheDocument();
  });

  it('[0010-add-v3-shell/AC-3] shows a Guest the logo but no Home entry', async () => {
    setViewportWidth(1280);
    await renderWithProviders({ roles: [], path: '/home' });

    const menu = await sideMenu();
    expect(within(menu).getByRole('img', { name: 'ERAS' })).toBeInTheDocument();
    expect(
      within(menu).queryByRole('link', { name: 'Home' })
    ).not.toBeInTheDocument();
  });
  it('[0010-add-v3-shell/AC-2] opens Home from its menu entry and marks it as current', async () => {
    setViewportWidth(1280);
    const { router } = await renderWithProviders({
      roles: ['ERAS Professional'],
      path: '/no-such-page',
    });

    const menu = await sideMenu();
    await userEvent.click(within(menu).getByRole('link', { name: 'Home' }));

    expect(router.state.location.pathname).toBe('/home');
    expect(within(menu).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
  it('[0010-add-v3-shell/AC-4] shows the title, the name and the role in the header', async () => {
    setViewportWidth(1280);
    await renderWithProviders({
      roles: ['ERAS Student Services Officer'],
      userName: 'Ana Torres',
      path: '/home',
    });

    const header = await screen.findByRole('banner');
    expect(
      within(header).getByRole('heading', { name: 'Home' })
    ).toBeInTheDocument();
    expect(within(header).getByText('Ana Torres')).toBeInTheDocument();
    expect(
      within(header).getByText('ERAS Student Services Officer')
    ).toBeInTheDocument();
  });

  it('[0010-add-v3-shell/AC-5] names a user without an ERAS role Guest', async () => {
    setViewportWidth(1280);
    await renderWithProviders({
      roles: [],
      userName: 'Luis Rojas',
      path: '/home',
    });

    const header = await screen.findByRole('banner');
    expect(within(header).getByText('Luis Rojas')).toBeInTheDocument();
    expect(within(header).getByText('Guest')).toBeInTheDocument();
  });
  it('[0010-add-v3-shell/AC-6] logs out from the user menu', async () => {
    setViewportWidth(1280);
    const logout = vi.fn(() => Promise.resolve());
    await renderWithProviders({
      roles: ['ERAS Professional'],
      userName: 'Ana Torres',
      path: '/home',
      logout,
    });

    await userEvent.click(
      await screen.findByRole('button', { name: 'User menu' })
    );
    const menu = await screen.findByRole('menu');
    expect(within(menu).getByText('Ana Torres')).toBeInTheDocument();
    expect(within(menu).getByText('ERAS Professional')).toBeInTheDocument();
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Log out' })
    );

    expect(logout).toHaveBeenCalledOnce();
  });

  it('[0010-add-v3-shell/AC-7] shows no Log out outside the user menu on Home', async () => {
    setViewportWidth(1280);
    await renderWithProviders({ roles: ['ERAS Administrator'], path: '/home' });

    expect(
      await screen.findByRole('heading', { name: 'Overview' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Log out')).not.toBeInTheDocument();
  });
  it('[0010-add-v3-shell/AC-8] keeps the side menu beside the content on a 1280px screen', async () => {
    setViewportWidth(1280);
    await renderWithProviders({ roles: ['ERAS Administrator'], path: '/home' });

    const menu = await sideMenu();
    expect(menu).toBeVisible();
    // Beside the content: the menu is not laid over the page in a modal layer.
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Open menu' })
    ).not.toBeInTheDocument();
  });

  it('[0010-add-v3-shell/AC-9] hides the side menu and compacts the header on a 375px screen', async () => {
    setViewportWidth(375);
    await renderWithProviders({
      roles: ['ERAS Administrator'],
      userName: 'Ana Torres',
      path: '/home',
    });

    const header = await screen.findByRole('banner');
    expect(
      within(header).getByRole('button', { name: 'Open menu' })
    ).toBeInTheDocument();
    expect(
      within(header).getByRole('heading', { name: 'Home' })
    ).toBeInTheDocument();
    expect(
      within(header).getByRole('button', { name: 'User menu' })
    ).toBeInTheDocument();
    expect(within(header).queryByText('Ana Torres')).not.toBeInTheDocument();
    expect(
      within(header).queryByText('ERAS Administrator')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('navigation', { name: 'Main menu' })
    ).not.toBeInTheDocument();
  });
  it('[0010-add-v3-shell/AC-10] opens the side menu over the content from the menu button', async () => {
    setViewportWidth(375);
    await renderWithProviders({ roles: ['ERAS Administrator'], path: '/home' });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Open menu' })
    );

    expect(await sideMenu()).toBeVisible();
    // Over the content: the menu sits in a modal layer above the page.
    expect(screen.getByRole('presentation')).toContainElement(
      screen.getByRole('navigation', { name: 'Main menu' })
    );
  });

  it('[0010-add-v3-shell/AC-11] closes the side menu when an entry is picked', async () => {
    setViewportWidth(375);
    const { router } = await renderWithProviders({
      roles: ['ERAS Professional'],
      path: '/no-such-page',
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Open menu' })
    );
    const menu = await sideMenu();

    await userEvent.click(within(menu).getByRole('link', { name: 'Home' }));

    expect(router.state.location.pathname).toBe('/home');
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('navigation', { name: 'Main menu' })
    );
  });

  it('[0010-add-v3-shell/AC-12] closes the side menu when the user taps outside it', async () => {
    setViewportWidth(375);
    const { router } = await renderWithProviders({
      roles: ['ERAS Administrator'],
      path: '/home',
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Open menu' })
    );
    await sideMenu();

    // The backdrop has no role or text; MUI's class is the only handle on it (design, Test strategy).
    const backdrop = document.querySelector('.MuiBackdrop-root');
    if (!(backdrop instanceof HTMLElement)) throw new Error('no backdrop');
    await userEvent.click(backdrop);

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('navigation', { name: 'Main menu' })
    );
    expect(router.state.location.pathname).toBe('/home');
  });
});
