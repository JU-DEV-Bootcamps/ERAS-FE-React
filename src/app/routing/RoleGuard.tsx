import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import { canAccess, type RoleKey } from '../../core/auth/access';
import { useSession } from '../session';

/** Renders its page only for a user with one of `roles`; sends anyone else to "access denied". */
export function RoleGuard({
  roles,
  children,
}: {
  roles: readonly RoleKey[];
  children: ReactNode;
}) {
  const session = useSession();
  if (!canAccess(session.roles, roles, session.roleNames)) {
    return <Navigate to="/access-denied" replace />;
  }
  return children;
}
