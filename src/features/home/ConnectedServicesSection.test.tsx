import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test/render';
import { homeHandlers } from './test-handlers';

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

/** A configuration as the backend returns it: the whole entity, secrets included. */
function configuration(id: number, configurationName: string) {
  return {
    id,
    userId: 'officer-1',
    configurationName,
    baseURL: 'https://cosmic-latte.example',
    encryptedKey: 'not-a-real-key',
    serviceProviderId: 7,
    isDeleted: false,
    audit: {
      createdBy: 'Maria Lopez',
      modifiedBy: 'Maria Lopez',
      createdAt: '2026-11-01T10:00:00Z',
      modifiedAt: null,
    },
  };
}

describe('ConnectedServicesSection', () => {
  it('[0008-port-home-to-v3/AC-13] shows an active and an inactive service of the Officer', async () => {
    server.use(
      http.get('*/api/v1/configurations/officer-1', () =>
        HttpResponse.json([
          configuration(1, 'Main'),
          configuration(2, 'Backup'),
        ])
      ),
      http.get('*/api/v1/service-providers', () =>
        HttpResponse.json([
          {
            id: 7,
            serviceProviderName: 'Cosmic Latte',
            serviceProviderLogo: '',
          },
        ])
      ),
      http.get('*/api/v1/cosmic-latte/health', ({ request }) => {
        const id = new URL(request.url).searchParams.get('ConfigurationId');
        return id === '1'
          ? HttpResponse.json({
              status: true,
              dateTime: '2026-11-20T10:00:00Z',
            })
          : HttpResponse.json({ message: 'Unreachable' }, { status: 500 });
      })
    );
    await renderWithProviders({
      roles: ['ERAS Student Services Officer'],
      userId: 'officer-1',
    });

    const section = await screen.findByRole('region', {
      name: 'Connected Services',
    });
    const main = await within(section).findByRole('article', { name: 'Main' });
    expect(within(main).getByText('Service: Cosmic Latte')).toBeInTheDocument();
    expect(
      within(main).getByText('Created by: Maria Lopez')
    ).toBeInTheDocument();
    expect(await within(main).findByText('ACTIVE')).toBeInTheDocument();

    const backup = within(section).getByRole('article', { name: 'Backup' });
    expect(await within(backup).findByText('INACTIVE')).toBeInTheDocument();
  });
});
