// The keys under which an alert's status and risk level have their text and color. A value the backend adds
// later falls back to "default": the status then reads "New", as in v2.

const STATUSES = [
  'Pending',
  'Ready',
  'InProgress',
  'Completed',
  'Uncompleted',
] as const;
const RISK_LEVELS = ['Low', 'Medium', 'High'] as const;

export type StatusKey = (typeof STATUSES)[number] | 'default';
export type RiskKey = (typeof RISK_LEVELS)[number] | 'default';

function isOneOf<T extends string>(
  values: readonly T[],
  value: string
): value is T {
  return (values as readonly string[]).includes(value);
}

export function statusKey(status: string): StatusKey {
  return isOneOf(STATUSES, status) ? status : 'default';
}

export function riskKey(level: string): RiskKey {
  return isOneOf(RISK_LEVELS, level) ? level : 'default';
}
