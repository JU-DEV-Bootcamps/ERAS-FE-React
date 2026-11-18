import type { AppConfig } from '../config/config';

export type RoleNames = AppConfig['roleNames'];
/** An ERAS role, named by its key; the Keycloak name comes from the runtime configuration. */
export type RoleKey = keyof RoleNames;

/**
 * Whether a user with these Keycloak roles may open a route that requires any of `required`.
 * A route without roles is open to every authenticated user; the Administrator passes every check
 * (AGENTS.md section 4.3).
 */
export function canAccess(userRoles: readonly string[], required: readonly RoleKey[], roleNames: RoleNames): boolean {
  if (required.length === 0) return true;
  if (userRoles.includes(roleNames.administrator)) return true;
  return required.some((role) => userRoles.includes(roleNames[role]));
}
