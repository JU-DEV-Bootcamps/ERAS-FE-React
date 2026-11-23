import { ApiError } from '../../core/http/api-error';

/**
 * Whether a failed Home request is the backend refusing a user with no ERAS role (a Guest). Home then shows the
 * section empty, without an error, as v2 does (design D12, AC-4). Any other failure, and any refusal to a user
 * with an ERAS role, is a real error that the section shows.
 */
export function isRefusedToGuest(error: unknown, isGuest: boolean): boolean {
  return isGuest && error instanceof ApiError && error.status === 403;
}
