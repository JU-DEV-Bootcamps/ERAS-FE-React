import { createContext, useContext, type ReactNode } from 'react';

import type { RoleNames } from '../core/auth/access';

/** What the screens know about the signed-in user. */
export interface Session {
  /** The Keycloak subject of the user, the id the backend scopes their own data by. */
  userId: string;
  /** The name the header and the user menu show. */
  userName: string;
  roles: readonly string[];
  roleNames: RoleNames;
  logout: () => Promise<void>;
}

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: Session;
  children: ReactNode;
}) {
  return <SessionContext value={session}>{children}</SessionContext>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error('useSession must be used inside a SessionProvider');
  }
  return session;
}
