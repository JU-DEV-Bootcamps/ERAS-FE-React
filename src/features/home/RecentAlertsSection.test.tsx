import { screen, within } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test/render';
import { alert, alertsHandler, homeHandlers } from './test-handlers';

const server = setupServer(...homeHandlers);

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

async function recentAlerts() {
  return screen.findByRole('region', { name: 'Recent Alerts' });
}

/** The data rows of the alerts table, without its header row. */
async function alertRows() {
  const section = await recentAlerts();
  const table = await within(section).findByRole('table');
  return within(table).getAllByRole('row').slice(1);
}

describe('RecentAlertsSection', () => {
  it('[0008-port-home-to-v3/AC-9] lists the five most recent alerts with their columns', async () => {
    server.use(
      alertsHandler([
        alert(),
        ...Array.from({ length: 7 }, (_, index) =>
          alert({
            studentId: `S-10${String(index)}`,
            studentName: `Student ${String(index)}`,
            riskLevel: 'Low',
            date: '2026-11-19T10:00:00Z',
          })
        ),
      ])
    );
    await renderWithProviders({ roles: ['ERAS Professional'] });

    const rows = await alertRows();
    expect(rows).toHaveLength(5);
    const [first] = rows;
    if (!first) throw new Error('no alert row');
    const cells = within(first)
      .getAllByRole('cell')
      .map(cell => cell.textContent);
    expect(cells).toEqual([
      'S-001',
      'Ana Torres',
      'High',
      'Academic',
      'Nov 20, 2026',
      'Completed',
    ]);
  });

  it('[0008-port-home-to-v3/AC-10] shows In Progress and New as readable statuses', async () => {
    server.use(
      alertsHandler([
        alert({ studentName: 'Ana Torres', status: 'InProgress' }),
        alert({ studentName: 'Luis Rojas', status: 'Archived' }),
      ])
    );
    await renderWithProviders({ roles: ['ERAS Professional'] });

    const [inProgress, unknown] = await alertRows();
    if (!inProgress || !unknown) throw new Error('missing alert rows');
    expect(within(inProgress).getByText('In Progress')).toBeInTheDocument();
    expect(
      within(inProgress).queryByText('InProgress')
    ).not.toBeInTheDocument();
    expect(within(unknown).getByText('New')).toBeInTheDocument();
    expect(within(unknown).queryByText('Archived')).not.toBeInTheDocument();
  });

  it('[0008-port-home-to-v3/AC-11] shows a message when there are no recent alerts', async () => {
    server.use(alertsHandler([]));
    await renderWithProviders({ roles: ['ERAS Professional'] });

    const section = await recentAlerts();
    expect(
      await within(section).findByText('No data available.')
    ).toBeInTheDocument();
    expect(within(section).queryByRole('table')).not.toBeInTheDocument();
  });

  it('[0008-port-home-to-v3/AC-12] links View All to /recent-alerts', async () => {
    await renderWithProviders({ roles: ['ERAS Professional'] });

    const section = await recentAlerts();
    expect(
      within(section).getByRole('link', { name: 'View All' })
    ).toHaveAttribute('href', '/recent-alerts');
  });
});
