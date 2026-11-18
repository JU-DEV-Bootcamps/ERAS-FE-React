import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';
import { initAuth } from './core/auth/auth';
import { loadConfig } from './core/config/config';
import { initI18n } from './core/i18n/i18n';

const root = document.getElementById('root');
if (!root) {
  throw new Error('The #root element is missing from index.html');
}
const container = root;

// Start order: runtime configuration, then login (a redirect to Keycloak when there is no session), then texts.
async function start() {
  const config = await loadConfig();
  const auth = await initAuth(config);
  const i18n = await initI18n();
  const session = { roles: auth.roles(), roleNames: config.roleNames, logout: auth.logout };

  createRoot(container).render(
    <StrictMode>
      <App i18n={i18n} session={session} />
    </StrictMode>,
  );
}

start().catch((error: unknown) => {
  container.textContent = `ERAS could not start: ${error instanceof Error ? error.message : String(error)}`;
});
