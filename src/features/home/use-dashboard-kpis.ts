import { useQuery } from '@tanstack/react-query';

import { useHttpClient } from '../../core/http/http-client-context';
import { getDashboardKpis } from './api';

/**
 * The key figures of the Overview. They are loaded once per session (design D2, A3): returning to Home reuses
 * them, and the query's dataUpdatedAt is the moment "Last Updated" refers to.
 */
export function useDashboardKpis() {
  const client = useHttpClient();
  return useQuery({
    queryKey: ['home', 'kpis'],
    queryFn: ({ signal }) => getDashboardKpis(client, signal),
    staleTime: Infinity,
  });
}
