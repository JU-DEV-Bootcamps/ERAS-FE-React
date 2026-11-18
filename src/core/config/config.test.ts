import { describe, expect, it } from 'vitest';

import { loadConfig } from './config';

const valid = {
  keycloak: { url: 'http://localhost:18080', realm: 'ERAS', clientId: 'eras-fe-react' },
  rolesResource: 'public-client',
  roleNames: {
    administrator: 'ERAS Administrator',
    officer: 'ERAS Student Services Officer',
    professional: 'ERAS Professional',
  },
};

function fetchReturning(body: string, status = 200): typeof fetch {
  return () => Promise.resolve(new Response(body, { status }));
}

describe('loadConfig', () => {
  it('returns the configuration when every key is present', async () => {
    await expect(loadConfig(fetchReturning(JSON.stringify(valid)))).resolves.toEqual(valid);
  });

  it('asks for /config.json', async () => {
    let asked = '';
    const spy: typeof fetch = (input) => {
      asked = input instanceof Request ? input.url : input.toString();
      return Promise.resolve(new Response(JSON.stringify(valid)));
    };
    await loadConfig(spy);
    expect(asked).toBe('/config.json');
  });

  it('rejects a missing key and names it', async () => {
    const withoutRealm = { ...valid, keycloak: { url: valid.keycloak.url, clientId: valid.keycloak.clientId } };
    await expect(loadConfig(fetchReturning(JSON.stringify(withoutRealm)))).rejects.toThrow('keycloak.realm');
  });

  it('rejects an empty role name and names it', async () => {
    const emptyRole = { ...valid, roleNames: { ...valid.roleNames, officer: '' } };
    await expect(loadConfig(fetchReturning(JSON.stringify(emptyRole)))).rejects.toThrow('roleNames.officer');
  });

  it('rejects a file that cannot be loaded', async () => {
    await expect(loadConfig(fetchReturning('not found', 404))).rejects.toThrow('could not be loaded (HTTP 404)');
  });

  it('rejects a file that is not JSON', async () => {
    await expect(loadConfig(fetchReturning('{ not json'))).rejects.toThrow('is not valid JSON');
  });
});
