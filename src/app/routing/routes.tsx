import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import type { SvgIconComponent } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { Navigate, type RouteObject } from 'react-router';

import type { RoleKey } from '../../core/auth/access';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';
import { HomePage } from '../../features/home/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AppShell } from '../shell/AppShell';
import { RoleGuard } from './RoleGuard';

/**
 * One screen of ERAS v3 and the roles that may open it (the v3 counterpart of v2's ROUTE_METADATA).
 * An empty `roles` list opens the route to every authenticated user.
 */
export interface AppRoute {
  path: string;
  element: ReactNode;
  roles: readonly RoleKey[];
  /** The i18n key of the title the header shows for this screen (design D2 of change 0010). */
  titleKey?: string;
  /** The side menu entry of this screen; a route without one is not listed. */
  menu?: { labelKey: string; icon: SvgIconComponent };
}

/** The screens of ERAS v3. Each module change adds its routes here, with the roles its spec gives them. */
export const appRoutes: AppRoute[] = [
  // The root address leads to Home, as in v2; replace keeps '/' out of the history.
  { path: '/', element: <Navigate to="/home" replace />, roles: [] },
  {
    path: '/home',
    element: <HomePage />,
    // Open to every signed-in user, as in v2; a Guest sees Home without its data (design D12).
    roles: [],
    titleKey: 'shell.titles.home',
    menu: { labelKey: 'shell.menu.home', icon: HomeRoundedIcon },
  },
];

/**
 * The router's route objects: the shell as a layout route around every screen (design D1 of change 0010), with each
 * app route behind its role guard, plus "access denied" and "not found".
 */
export function buildRouteObjects(routes: readonly AppRoute[]): RouteObject[] {
  return [
    {
      element: <AppShell routes={routes} />,
      children: [
        ...routes.map(route => ({
          path: route.path,
          element: <RoleGuard roles={route.roles}>{route.element}</RoleGuard>,
          handle: { titleKey: route.titleKey },
        })),
        { path: '/access-denied', element: <AccessDeniedPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ];
}
