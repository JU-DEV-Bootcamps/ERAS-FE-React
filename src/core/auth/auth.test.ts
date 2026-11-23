import type { KeycloakInitOptions } from 'keycloak-js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AppConfig } from '../config/config';
import {
  initAuth,
  MIN_TOKEN_VALIDITY_SECONDS,
  type KeycloakLike,
} from './auth';

const config: AppConfig = {
  keycloak: {
    url: 'http://localhost:18080',
    realm: 'ERAS',
    clientId: 'eras-fe-react',
  },
  rolesResource: 'public-client',
  roleNames: {
    administrator: 'ERAS Administrator',
    officer: 'ERAS Student Services Officer',
    professional: 'ERAS Professional',
  },
};

class FakeKeycloak implements KeycloakLike {
  authenticated = false;
  token?: string;
  tokenParsed?: NonNullable<KeycloakLike['tokenParsed']>;
  onTokenExpired?: () => void;
  initOptions: KeycloakInitOptions | undefined;
  refreshFails = false;
  readonly login = vi.fn(() => Promise.resolve());
  readonly logout = vi.fn(() => Promise.resolve());
  readonly updateToken = vi.fn(() => {
    if (this.refreshFails) return Promise.reject(new Error('refresh failed'));
    this.token = 'refreshed-token';
    return Promise.resolve(true);
  });

  constructor(readonly options: AppConfig['keycloak']) {}

  init(options: KeycloakInitOptions): Promise<boolean> {
    this.initOptions = options;
    this.authenticated = true;
    this.token = 'first-token';
    this.tokenParsed = {
      resource_access: {
        'public-client': { roles: ['ERAS Professional'] },
        'other-client': { roles: ['Something else'] },
      },
    };
    return Promise.resolve(true);
  }
}

async function start() {
  let created: FakeKeycloak | undefined;
  const auth = await initAuth(config, options => {
    created = new FakeKeycloak(options);
    return created;
  });
  if (!created) throw new Error('no Keycloak instance was created');
  return { auth, keycloak: created };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('initAuth', () => {
  it('creates the Keycloak client from the runtime configuration', async () => {
    const { keycloak } = await start();
    expect(keycloak.options).toEqual(config.keycloak);
  });

  it('logs in by redirect with PKCE S256 and without the check-sso iframe', async () => {
    const { keycloak } = await start();
    expect(keycloak.initOptions).toMatchObject({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    });
    expect(keycloak.initOptions).not.toHaveProperty(
      'silentCheckSsoRedirectUri'
    );
  });

  it('starts from no stored token', async () => {
    const { keycloak } = await start();
    expect(keycloak.initOptions).not.toHaveProperty('token');
    expect(keycloak.initOptions).not.toHaveProperty('refreshToken');
  });

  it('never writes a token to localStorage or sessionStorage', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const { auth, keycloak } = await start();
    await auth.getToken();
    keycloak.onTokenExpired?.();
    expect(setItem).not.toHaveBeenCalled();
  });

  it('refreshes the token before returning it', async () => {
    const { auth, keycloak } = await start();
    await expect(auth.getToken()).resolves.toBe('refreshed-token');
    expect(keycloak.updateToken).toHaveBeenCalledWith(
      MIN_TOKEN_VALIDITY_SECONDS
    );
  });

  it('refreshes the token when it expires', async () => {
    const { keycloak } = await start();
    keycloak.onTokenExpired?.();
    expect(keycloak.updateToken).toHaveBeenCalledWith(
      MIN_TOKEN_VALIDITY_SECONDS
    );
  });

  it('sends the user to log in again when the refresh fails', async () => {
    const { auth, keycloak } = await start();
    keycloak.refreshFails = true;
    await expect(auth.getToken()).rejects.toThrow();
    expect(keycloak.login).toHaveBeenCalled();
  });

  it('reads the roles of the configured roles resource only', async () => {
    const { auth } = await start();
    expect(auth.roles()).toEqual(['ERAS Professional']);
  });

  it('gives the Keycloak subject of the token as the user id', async () => {
    const { auth, keycloak } = await start();
    keycloak.tokenParsed = { sub: 'user-123' };
    expect(auth.userId()).toBe('user-123');
  });

  it('has an empty user id when the token carries no subject', async () => {
    const { auth, keycloak } = await start();
    keycloak.tokenParsed = {};
    expect(auth.userId()).toBe('');
  });

  it('has no role when the token carries no roles resource', async () => {
    const { auth, keycloak } = await start();
    keycloak.tokenParsed = {};
    expect(auth.roles()).toEqual([]);
  });
});
