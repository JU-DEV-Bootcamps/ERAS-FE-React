import type { i18n } from 'i18next';
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { AppProviders } from './AppProviders';
import { appRoutes, buildRouteObjects } from './routing/routes';
import { SessionProvider, type Session } from './session';

interface AppProps {
  i18n: i18n;
  session: Session;
}

export function App({ i18n, session }: AppProps) {
  const [router] = useState(() =>
    createBrowserRouter(buildRouteObjects(appRoutes))
  );
  return (
    <AppProviders i18n={i18n}>
      <SessionProvider session={session}>
        <RouterProvider router={router} />
      </SessionProvider>
    </AppProviders>
  );
}
