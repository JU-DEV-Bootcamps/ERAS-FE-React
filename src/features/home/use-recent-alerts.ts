import { useQuery } from '@tanstack/react-query';

import { useHttpClient } from '../../core/http/http-client-context';
import { getRecentAlerts } from './api';

/** The most recent student alerts shown on Home. */
export function useRecentAlerts() {
  const client = useHttpClient();
  return useQuery({
    queryKey: ['home', 'recent-alerts'],
    queryFn: ({ signal }) => getRecentAlerts(client, signal),
  });
}
