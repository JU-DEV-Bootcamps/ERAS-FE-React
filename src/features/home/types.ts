// The backend responses Home reads (ADR-0014), with only the fields Home uses. Mirrors, read only:
// ERAS-BE DashboardKpiDto in GetQueryResponse, PagedResult<GetStudentsRecentAlertsResponse>, the Configurations
// and ServiceProviders entities, and CosmicLatteStatus.

export interface KpiMetric {
  value: number;
  percentageChange: number;
}

export interface DashboardKpis {
  totalStudents: KpiMetric;
  totalPollsAnswered: KpiMetric;
  totalEvaluations: KpiMetric;
}

/** GET dashboard/kpis answers in the backend's BaseResponse envelope. */
export interface DashboardKpisResponse {
  body: DashboardKpis;
}

export interface RecentAlert {
  studentId: string;
  studentName: string;
  /** Low, Medium or High today; kept as a string so a new level shows its default label. */
  riskLevel: string;
  category: string;
  /** ISO date and time, or null when the alert has none. */
  date: string | null;
  status: string;
}

export interface RecentAlertsPage {
  count: number;
  items: RecentAlert[];
}

/** A service configuration of the user; the backend also sends its URL and key, which Home never reads. */
export interface ServiceConfiguration {
  id: number;
  configurationName: string;
  serviceProviderId: number;
  audit: { createdBy: string };
}

export interface ServiceProvider {
  id: number;
  serviceProviderName: string;
}

/** The live check of one configuration's service. */
export interface ServiceHealth {
  status: boolean;
}
