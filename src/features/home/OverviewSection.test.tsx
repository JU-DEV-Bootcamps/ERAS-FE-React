import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test/render';
import { defaultKpis, homeHandlers, kpisHandler } from './test-handlers';

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

async function figure(title: string) {
  const overview = await screen.findByRole('region', { name: 'Overview' });
  return within(overview).findByRole('article', { name: title });
}

describe('OverviewSection', () => {
  it('[0008-port-home-to-v3/AC-5] shows the three key figures with their change and an up arrow', async () => {
    server.use(kpisHandler(defaultKpis));
    await renderWithProviders({ roles: ['ERAS Professional'] });

    const students = await figure('Number of Students');
    expect(within(students).getByText('120')).toBeInTheDocument();
    expect(within(students).getByText('12.5%')).toBeInTheDocument();
    expect(
      within(students).getByRole('img', { name: 'Increase' })
    ).toBeInTheDocument();

    const polls = await figure('Polls Answered');
    expect(within(polls).getByText('340')).toBeInTheDocument();
    expect(within(polls).getByText('3%')).toBeInTheDocument();
    expect(
      within(polls).getByRole('img', { name: 'Increase' })
    ).toBeInTheDocument();

    const evaluations = await figure('Evaluations');
    expect(within(evaluations).getByText('45')).toBeInTheDocument();
    expect(within(evaluations).getByText('0%')).toBeInTheDocument();
    expect(
      within(evaluations).getByRole('img', { name: 'Increase' })
    ).toBeInTheDocument();
  });

  it('[0008-port-home-to-v3/AC-6] shows a negative change without its sign and a down arrow', async () => {
    server.use(
      kpisHandler({
        ...defaultKpis,
        totalPollsAnswered: { value: 80, percentageChange: -4.2 },
      })
    );
    await renderWithProviders({ roles: ['ERAS Professional'] });

    const polls = await figure('Polls Answered');
    expect(within(polls).getByText('80')).toBeInTheDocument();
    expect(within(polls).getByText('4.2%')).toBeInTheDocument();
    expect(within(polls).queryByText('-4.2%')).not.toBeInTheDocument();
    expect(
      within(polls).getByRole('img', { name: 'Decrease' })
    ).toBeInTheDocument();
    expect(
      within(polls).queryByRole('img', { name: 'Increase' })
    ).not.toBeInTheDocument();
  });

  it('[0008-port-home-to-v3/AC-8] shows Last Updated: Just Now for figures loaded 3 seconds ago', async () => {
    await renderWithProviders({ roles: ['ERAS Professional'] });
    const overview = await screen.findByRole('region', { name: 'Overview' });
    await figure('Number of Students');

    expect(
      within(overview).getByText('Last Updated: Just Now')
    ).toBeInTheDocument();
  });

  it('[0008-port-home-to-v3/AC-7] explains Number of Students when its title is focused', async () => {
    await renderWithProviders({ roles: ['ERAS Professional'] });
    const students = await figure('Number of Students');
    const title = within(students).getByText('Number of Students');

    // WHEN: the user moves the keyboard focus to the title
    for (let step = 0; step < 10 && document.activeElement !== title; step++) {
      await userEvent.tab();
    }

    expect(title).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Number of students enrolled during the current 6-month period, compared to the same period last cycle.'
    );
  });
});
