// Runtime configuration of ERAS v3, read from /config.json before the app renders, so one build serves every
// environment. It holds no API URL: the app always calls /api on its own origin.

export interface AppConfig {
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
  };
  /** The Keycloak client whose roles the backend reads (resource_access[rolesResource].roles). */
  rolesResource: string;
  /** The ERAS role names (AGENTS.md section 4.3), as configured in Keycloak. */
  roleNames: {
    administrator: string;
    officer: string;
    professional: string;
  };
}

const REQUIRED_KEYS = [
  'keycloak.url',
  'keycloak.realm',
  'keycloak.clientId',
  'rolesResource',
  'roleNames.administrator',
  'roleNames.officer',
  'roleNames.professional',
] as const;

const CONFIG_URL = '/config.json';

function valueAt(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current !== null && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

export async function loadConfig(
  fetchFn: typeof fetch = fetch
): Promise<AppConfig> {
  const response = await fetchFn(CONFIG_URL);
  if (!response.ok) {
    throw new Error(
      `${CONFIG_URL} could not be loaded (HTTP ${String(response.status)})`
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(await response.text());
  } catch {
    throw new Error(`${CONFIG_URL} is not valid JSON`);
  }

  const missing = REQUIRED_KEYS.filter(key => {
    const value = valueAt(parsed, key);
    return typeof value !== 'string' || value.trim() === '';
  });
  if (missing.length > 0) {
    throw new Error(
      `${CONFIG_URL} is missing or has an empty value for: ${missing.join(', ')}`
    );
  }

  return parsed as AppConfig;
}
