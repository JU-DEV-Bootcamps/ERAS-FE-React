// Login of ERAS v3 with Keycloak (ADR-0013): its own public client, authorization code flow with PKCE S256,
// login by redirect without the check-sso iframe, tokens kept only in memory by the keycloak-js instance.
// This module never writes a token to localStorage or sessionStorage.
import Keycloak from 'keycloak-js';

import type { AppConfig } from '../config/config';

/** Seconds a token must still be valid for; a token closer to its expiry is refreshed first. */
export const MIN_TOKEN_VALIDITY_SECONDS = 30;

/** The part of a keycloak-js instance this module uses (lets the tests pass a fake one). */
export type KeycloakLike = Pick<
  Keycloak,
  | 'init'
  | 'login'
  | 'logout'
  | 'updateToken'
  | 'token'
  | 'tokenParsed'
  | 'authenticated'
  | 'onTokenExpired'
>;

export type KeycloakFactory = (options: AppConfig['keycloak']) => KeycloakLike;

export interface Auth {
  /** A valid access token, refreshed first when it expires within MIN_TOKEN_VALIDITY_SECONDS. */
  getToken: () => Promise<string>;
  /** The roles of the configured roles resource (resource_access[rolesResource].roles). */
  roles: () => string[];
  /** The Keycloak subject (`sub`) of the signed-in user, the user id the backend stores. */
  userId: () => string;
  /** The signed-in user's first and last name from the token, or its full name, or an empty string. */
  userName: () => string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** The name to show for the user: given and family name, else the full name (design D4 of change 0010). */
function userNameOf(token: KeycloakLike['tokenParsed']): string {
  const parts = [text(token?.given_name), text(token?.family_name)].filter(
    part => part !== ''
  );
  return parts.length > 0 ? parts.join(' ') : text(token?.name);
}

const createKeycloak: KeycloakFactory = options => new Keycloak(options);

export async function initAuth(
  config: AppConfig,
  create: KeycloakFactory = createKeycloak
): Promise<Auth> {
  const keycloak = create(config.keycloak);

  await keycloak.init({
    onLoad: 'login-required',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  });

  keycloak.onTokenExpired = () => {
    keycloak
      .updateToken(MIN_TOKEN_VALIDITY_SECONDS)
      .catch(() => keycloak.login());
  };

  return {
    async getToken() {
      try {
        await keycloak.updateToken(MIN_TOKEN_VALIDITY_SECONDS);
      } catch (error) {
        await keycloak.login();
        throw new Error('The session expired; logging in again', {
          cause: error,
        });
      }
      if (!keycloak.token) {
        throw new Error('No access token after login');
      }
      return keycloak.token;
    },
    roles() {
      return (
        keycloak.tokenParsed?.resource_access?.[config.rolesResource]?.roles ??
        []
      );
    },
    userId() {
      return keycloak.tokenParsed?.sub ?? '';
    },
    userName() {
      return userNameOf(keycloak.tokenParsed);
    },
    login: () => keycloak.login(),
    logout: () => keycloak.logout(),
  };
}
