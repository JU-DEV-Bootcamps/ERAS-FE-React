import type { RoleNames } from '../../core/auth/access';

export type RoleLabelKey =
  | 'shell.roles.administrator'
  | 'shell.roles.officer'
  | 'shell.roles.professional'
  | 'shell.roles.guest';

/**
 * The i18n key of the role the header and the user menu show, in v2's order of precedence: administrator,
 * officer, professional, else Guest (design D4 of change 0010).
 */
export function roleLabelKey(
  userRoles: readonly string[],
  roleNames: RoleNames
): RoleLabelKey {
  if (userRoles.includes(roleNames.administrator))
    return 'shell.roles.administrator';
  if (userRoles.includes(roleNames.officer)) return 'shell.roles.officer';
  if (userRoles.includes(roleNames.professional))
    return 'shell.roles.professional';
  return 'shell.roles.guest';
}
