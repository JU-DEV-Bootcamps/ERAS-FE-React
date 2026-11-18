import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router';

import type { RoleKey } from '../../core/auth/access';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RoleGuard } from './RoleGuard';

/**
 * One screen of ERAS v3 and the roles that may open it (the v3 counterpart of v2's ROUTE_METADATA).
 * An empty `roles` list opens the route to every authenticated user.
 */
export interface AppRoute {
  path: string;
  element: ReactNode;
  roles: readonly RoleKey[];
}

/** The screens of ERAS v3. Each module change adds its routes here, with the roles its spec gives them. */
export const appRoutes: AppRoute[] = [{ path: '/', element: <HomePage />, roles: [] }];

/** The router's route objects: every app route behind its role guard, plus "access denied" and "not found". */
export function buildRouteObjects(routes: readonly AppRoute[]): RouteObject[] {
  return [
    ...routes.map((route) => ({
      path: route.path,
      element: <RoleGuard roles={route.roles}>{route.element}</RoleGuard>,
    })),
    { path: '/access-denied', element: <AccessDeniedPage /> },
    { path: '*', element: <NotFoundPage /> },
  ];
}
