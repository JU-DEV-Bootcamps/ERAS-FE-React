// Runtime checks of every response Home reads (design D9). Each schema must match its interface in types.ts,
// and object schemas drop every key they do not declare, so fields Home does not use never reach the app.
import { z } from 'zod';

import type {
  DashboardKpis,
  DashboardKpisResponse,
  KpiMetric,
  RecentAlert,
  RecentAlertsPage,
  ServiceConfiguration,
  ServiceHealth,
  ServiceProvider,
} from './types';

const kpiMetricSchema = z.object({
  value: z.number(),
  percentageChange: z.number(),
}) satisfies z.ZodType<KpiMetric>;

const dashboardKpisSchema = z.object({
  totalStudents: kpiMetricSchema,
  totalPollsAnswered: kpiMetricSchema,
  totalEvaluations: kpiMetricSchema,
}) satisfies z.ZodType<DashboardKpis>;

export const dashboardKpisResponseSchema = z.object({
  body: dashboardKpisSchema,
}) satisfies z.ZodType<DashboardKpisResponse>;

const recentAlertSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  riskLevel: z.string(),
  category: z.string(),
  date: z.string().nullable(),
  status: z.string(),
}) satisfies z.ZodType<RecentAlert>;

export const recentAlertsPageSchema = z.object({
  count: z.number(),
  items: z.array(recentAlertSchema),
}) satisfies z.ZodType<RecentAlertsPage>;

/** Strips baseURL, encryptedKey and every other key Home does not declare (design D9). */
export const serviceConfigurationsSchema = z.array(
  z.object({
    id: z.number(),
    configurationName: z.string(),
    serviceProviderId: z.number(),
    audit: z.object({ createdBy: z.string() }),
  }) satisfies z.ZodType<ServiceConfiguration>
);

export const serviceProvidersSchema = z.array(
  z.object({
    id: z.number(),
    serviceProviderName: z.string(),
  }) satisfies z.ZodType<ServiceProvider>
);

export const serviceHealthSchema = z.object({
  status: z.boolean(),
}) satisfies z.ZodType<ServiceHealth>;
