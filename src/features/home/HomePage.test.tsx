import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
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

import { setViewportWidth } from '../../test/media';
import { renderWithProviders } from '../../test/render';
import { alert, alertsHandler, homeHandlers } from './test-handlers';

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

function sectionTitle(name: string) {
  return screen.findByRole('heading', { name });
}

describe('HomePage', () => {
  it('[0008-port-home-to-v3/AC-1] shows Overview, Recent Alerts and Connected Services to an Administrator', async () => {
    await renderWithProviders({ roles: ['ERAS Administrator'] });

    expect(await sectionTitle('Overview')).toBeInTheDocument();
    expect(await sectionTitle('Recent Alerts')).toBeInTheDocument();
    expect(await sectionTitle('Connected Services')).toBeInTheDocument();
  });

  it('[0008-port-home-to-v3/AC-2] shows Overview, Recent Alerts and Connected Services to an Officer', async () => {
    await renderWithProviders({ roles: ['ERAS Student Services Officer'] });

    expect(await sectionTitle('Overview')).toBeInTheDocument();
    expect(await sectionTitle('Recent Alerts')).toBeInTheDocument();
    expect(await sectionTitle('Connected Services')).toBeInTheDocument();
  });

  it('[0008-port-home-to-v3/AC-3] shows Overview and Recent Alerts to a Professional', async () => {
    await renderWithProviders({ roles: ['ERAS Professional'] });

    expect(await sectionTitle('Overview')).toBeInTheDocument();
    expect(await sectionTitle('Recent Alerts')).toBeInTheDocument();
  });

  it('[0008-port-home-to-v3/AC-4] shows a Guest Overview and Recent Alerts empty, without an error', async () => {
    // GIVEN: the backend refuses the key figures and the alerts to a user with no ERAS role
    const refused = () =>
      HttpResponse.json(
        { statusCode: 403, message: 'Forbidden' },
        { status: 403 }
      );
    server.use(
      http.get('*/api/v1/dashboard/kpis', refused),
      http.get('*/api/v1/evaluations/alerts', refused)
    );

    await renderWithProviders({ roles: [], path: '/home' });

    expect(await sectionTitle('Overview')).toBeInTheDocument();
    expect(await sectionTitle('Recent Alerts')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Connected Services' })
    ).not.toBeInTheDocument();
  });

  it('[0008-port-home-to-v3/AC-14] leaves out Connected Services for a Professional and does not request it', async () => {
    const paths: string[] = [];
    server.events.on('request:start', ({ request }) => {
      paths.push(new URL(request.url).pathname);
    });

    await renderWithProviders({ roles: ['ERAS Professional'] });
    await screen.findByRole('article', { name: 'Number of Students' });

    expect(
      screen.queryByRole('heading', { name: 'Connected Services' })
    ).not.toBeInTheDocument();
    expect(
      paths.filter(path =>
        /\/api\/v1\/(configurations|service-providers|cosmic-latte)/.test(path)
      )
    ).toEqual([]);
    server.events.removeAllListeners();
  });

  it('[0008-port-home-to-v3/AC-15] shows the Overview error and still lists the alerts', async () => {
    server.use(
      http.get('*/api/v1/dashboard/kpis', () =>
        HttpResponse.json(
          { statusCode: 500, message: 'Database down', detailed: 'at Eras…' },
          { status: 500 }
        )
      ),
      alertsHandler([alert({ studentName: 'Ana Torres' })])
    );

    await renderWithProviders({ roles: ['ERAS Professional'] });

    const overview = await screen.findByRole('region', { name: 'Overview' });
    expect(
      await within(overview).findByText('The key figures could not be loaded.')
    ).toBeInTheDocument();
    expect(within(overview).queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByText('Database down')).not.toBeInTheDocument();

    const alerts = screen.getByRole('region', { name: 'Recent Alerts' });
    expect(await within(alerts).findByText('Ana Torres')).toBeInTheDocument();
  });

  it('[0008-port-home-to-v3/AC-16] lays Home out in one column on a 375px screen', async () => {
    setViewportWidth(375);
    server.use(alertsHandler([alert()]));
    await renderWithProviders({ roles: ['ERAS Student Services Officer'] });

    const students = await screen.findByRole('article', {
      name: 'Number of Students',
    });
    const figures = students.parentElement;
    const overview = screen.getByRole('region', { name: 'Overview' });
    const home = overview.parentElement;
    if (!figures || !home) throw new Error('layout containers not found');

    // The three figures one below the other, then Recent Alerts, then Connected Services.
    expect(getComputedStyle(figures).gridTemplateColumns).toBe('1fr');
    expect(getComputedStyle(home).gridTemplateColumns).toBe('1fr');
    expect(
      within(home)
        .getAllByRole('region')
        .map(region => region.getAttribute('aria-label'))
    ).toEqual(['Overview', 'Recent Alerts', 'Connected Services']);

    // No horizontal page scroll: only the alerts table may scroll, inside its own container.
    const table = await screen.findByRole('table');
    const tableContainer = table.parentElement;
    if (!tableContainer) throw new Error('table container not found');
    expect(getComputedStyle(tableContainer).overflowX).toBe('auto');
  });

  it('[0008-port-home-to-v3/AC-17] lays Home out in three columns on a 1280px screen', async () => {
    setViewportWidth(1280);
    await renderWithProviders({ roles: ['ERAS Student Services Officer'] });

    const students = await screen.findByRole('article', {
      name: 'Number of Students',
    });
    const figures = students.parentElement;
    const home = screen.getByRole('region', { name: 'Overview' }).parentElement;
    if (!figures || !home) throw new Error('layout containers not found');

    expect(getComputedStyle(figures).gridTemplateColumns).toBe(
      'repeat(3, 1fr)'
    );
    expect(getComputedStyle(home).gridTemplateColumns).toBe('repeat(3, 1fr)');
    expect(
      getComputedStyle(screen.getByRole('region', { name: 'Recent Alerts' }))
        .gridColumn
    ).toBe('span 2');
  });

  it('[0008-port-home-to-v3/AC-18] sends the root address to /home and shows Home', async () => {
    const { router } = await renderWithProviders({
      roles: ['ERAS Student Services Officer'],
      path: '/',
    });

    expect(await sectionTitle('Overview')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/home');
  });

  it('puts Connected Services below Recent Alerts, across the whole row, on a wide screen', async () => {
    setViewportWidth(1280);
    await renderWithProviders({ roles: ['ERAS Student Services Officer'] });

    const services = await screen.findByRole('region', {
      name: 'Connected Services',
    });
    expect(getComputedStyle(services).gridColumn).toBe('1 / -1');
  });

  it('[0008-port-home-to-v3/AC-19] lets a Guest log out from Home', async () => {
    const logout = vi.fn(() => Promise.resolve());
    await renderWithProviders({ roles: [], path: '/home', logout });

    // Log out lives in the user menu of the header (change 0010-add-v3-shell, design D5).
    await userEvent.click(
      await screen.findByRole('button', { name: 'User menu' })
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Log out' })
    );

    expect(logout).toHaveBeenCalledOnce();
  });

  it('still shows the error when the backend refuses a user who has an ERAS role', async () => {
    server.use(
      http.get('*/api/v1/dashboard/kpis', () =>
        HttpResponse.json(
          { statusCode: 403, message: 'Forbidden' },
          { status: 403 }
        )
      )
    );
    await renderWithProviders({ roles: ['ERAS Professional'] });

    const overview = await screen.findByRole('region', { name: 'Overview' });
    expect(
      await within(overview).findByText('The key figures could not be loaded.')
    ).toBeInTheDocument();
  });
});
