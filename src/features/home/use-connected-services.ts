import { useQueries, useQuery } from '@tanstack/react-query';

import { useSession } from '../../app/session';
import { useHttpClient } from '../../core/http/http-client-context';
import {
  getServiceHealth,
  getServiceProviders,
  getUserConfigurations,
} from './api';

/** "checking" while the live check runs; a failed check counts as inactive (design D6). */
export type ServiceState = 'checking' | 'active' | 'inactive';

export interface ConnectedService {
  id: number;
  configurationName: string;
  serviceProviderName: string;
  createdBy: string;
  state: ServiceState;
}

/**
 * The signed-in user's service configurations with their provider and a live check of each one. Only mounted
 * for an Administrator or an Officer (design D5): the backend refuses these endpoints to everyone else.
 */
export function useConnectedServices() {
  const client = useHttpClient();
  const { userId } = useSession();
  const configurations = useQuery({
    queryKey: ['home', 'configurations', userId],
    queryFn: ({ signal }) => getUserConfigurations(client, userId, signal),
  });
  const providers = useQuery({
    queryKey: ['home', 'service-providers'],
    queryFn: ({ signal }) => getServiceProviders(client, signal),
  });
  const configurationList = configurations.data ?? [];
  const checks = useQueries({
    queries: configurationList.map(configuration => ({
      queryKey: ['home', 'service-health', configuration.id],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getServiceHealth(client, configuration.id, signal),
      retry: false,
    })),
  });

  const services: ConnectedService[] = configurationList.map(
    (configuration, index) => {
      const check = checks[index];
      const provider = providers.data?.find(
        item => item.id === configuration.serviceProviderId
      );
      let state: ServiceState = 'inactive';
      if (!check || check.isPending) state = 'checking';
      else if (check.data?.status === true) state = 'active';
      return {
        id: configuration.id,
        configurationName: configuration.configurationName,
        serviceProviderName: provider?.serviceProviderName ?? '',
        createdBy: configuration.audit.createdBy,
        state,
      };
    }
  );

  return {
    isPending: configurations.isPending || providers.isPending,
    isError: configurations.isError || providers.isError,
    services,
  };
}
