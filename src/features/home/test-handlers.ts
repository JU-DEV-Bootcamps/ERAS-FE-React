// MSW answers of the backend endpoints Home reads, shared by the Home tests. Each test overrides the answer
// of its scenario with server.use(); these defaults keep the other sections quiet.
import { http, HttpResponse } from 'msw';

export interface KpiAnswer {
  totalStudents: { value: number; percentageChange: number };
  totalPollsAnswered: { value: number; percentageChange: number };
  totalEvaluations: { value: number; percentageChange: number };
}

export const defaultKpis: KpiAnswer = {
  totalStudents: { value: 120, percentageChange: 12.5 },
  totalPollsAnswered: { value: 340, percentageChange: 3 },
  totalEvaluations: { value: 45, percentageChange: 0 },
};

export interface AlertAnswer {
  studentId: string;
  studentName: string;
  riskLevel: string;
  category: string;
  date: string | null;
  status: string;
}

export function alert(overrides: Partial<AlertAnswer> = {}): AlertAnswer {
  return {
    studentId: 'S-001',
    studentName: 'Ana Torres',
    riskLevel: 'High',
    category: 'Academic',
    date: '2026-11-20T10:00:00Z',
    status: 'Completed',
    ...overrides,
  };
}

/** The KPI endpoint answering in the backend's BaseResponse envelope. */
export function kpisHandler(body: KpiAnswer = defaultKpis) {
  return http.get('*/api/v1/dashboard/kpis', () =>
    HttpResponse.json({
      success: true,
      message: '',
      validationErrors: [],
      status: 'Success',
      body,
    })
  );
}

/** The recent alerts endpoint; like the backend, it returns at most PageSize items. */
export function alertsHandler(items: AlertAnswer[] = []) {
  return http.get('*/api/v1/evaluations/alerts', ({ request }) => {
    const pageSize = Number(new URL(request.url).searchParams.get('PageSize'));
    return HttpResponse.json({
      count: items.length,
      items: items.slice(0, pageSize),
    });
  });
}

export const homeHandlers = [
  kpisHandler(),
  alertsHandler(),
  http.get('*/api/v1/configurations/:userId', () => HttpResponse.json([])),
  http.get('*/api/v1/service-providers', () => HttpResponse.json([])),
];
