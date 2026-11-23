// The backend calls of Home (ADR-0014): one typed function per endpoint, on the client of src/core/http, each
// returning data checked by its schema (design D9).
import type { z } from 'zod';

import { ApiError } from '../../core/http/api-error';
import type { HttpClient } from '../../core/http/http';
import {
  dashboardKpisResponseSchema,
  recentAlertsPageSchema,
  serviceConfigurationsSchema,
  serviceHealthSchema,
  serviceProvidersSchema,
} from './schemas';
import type {
  DashboardKpis,
  RecentAlertsPage,
  ServiceConfiguration,
  ServiceHealth,
  ServiceProvider,
} from './types';

/** How many alerts Home lists. */
export const RECENT_ALERTS_PAGE_SIZE = 5;

function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError(0, 'The response does not have the expected shape', []);
  }
  return result.data;
}

export async function getDashboardKpis(
  client: HttpClient,
  signal: AbortSignal
): Promise<DashboardKpis> {
  const response = await client.get<unknown>('/dashboard/kpis', { signal });
  return parse(dashboardKpisResponseSchema, response.data).body;
}

export async function getRecentAlerts(
  client: HttpClient,
  signal: AbortSignal
): Promise<RecentAlertsPage> {
  const response = await client.get<unknown>('/evaluations/alerts', {
    params: { PageSize: RECENT_ALERTS_PAGE_SIZE, Page: 0 },
    signal,
  });
  return parse(recentAlertsPageSchema, response.data);
}

/** The service configurations the user owns. */
export async function getUserConfigurations(
  client: HttpClient,
  userId: string,
  signal: AbortSignal
): Promise<ServiceConfiguration[]> {
  const response = await client.get<unknown>(
    `/configurations/${encodeURIComponent(userId)}`,
    { signal }
  );
  return parse(serviceConfigurationsSchema, response.data);
}

export async function getServiceProviders(
  client: HttpClient,
  signal: AbortSignal
): Promise<ServiceProvider[]> {
  const response = await client.get<unknown>('/service-providers', { signal });
  return parse(serviceProvidersSchema, response.data);
}

/** The live check of the service behind one configuration. */
export async function getServiceHealth(
  client: HttpClient,
  configurationId: number,
  signal: AbortSignal
): Promise<ServiceHealth> {
  const response = await client.get<unknown>('/cosmic-latte/health', {
    params: { ConfigurationId: configurationId },
    signal,
  });
  return parse(serviceHealthSchema, response.data);
}
