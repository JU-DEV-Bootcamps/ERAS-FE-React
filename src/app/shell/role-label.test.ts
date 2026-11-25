import { describe, expect, it } from 'vitest';

import { roleLabelKey } from './role-label';

const roleNames = {
  administrator: 'ERAS Administrator',
  officer: 'ERAS Student Services Officer',
  professional: 'ERAS Professional',
};

describe('roleLabelKey', () => {
  it('names the Administrator first, as v2 does', () => {
    expect(
      roleLabelKey(['ERAS Professional', 'ERAS Administrator'], roleNames)
    ).toBe('shell.roles.administrator');
  });

  it('names the Officer before the Professional', () => {
    expect(
      roleLabelKey(
        ['ERAS Professional', 'ERAS Student Services Officer'],
        roleNames
      )
    ).toBe('shell.roles.officer');
  });

  it('names the Professional', () => {
    expect(roleLabelKey(['ERAS Professional'], roleNames)).toBe(
      'shell.roles.professional'
    );
  });

  it('names a user with no ERAS role Guest', () => {
    expect(roleLabelKey(['Something else'], roleNames)).toBe(
      'shell.roles.guest'
    );
  });
});
