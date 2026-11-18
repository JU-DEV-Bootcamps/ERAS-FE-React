import { describe, expect, it } from 'vitest';

import { canAccess } from './access';

const roleNames = {
  administrator: 'ERAS Administrator',
  officer: 'ERAS Student Services Officer',
  professional: 'ERAS Professional',
};

describe('canAccess', () => {
  it('opens a route without roles to any authenticated user, even one with no ERAS role', () => {
    expect(canAccess([], [], roleNames)).toBe(true);
  });

  it('lets in a user who has one of the required roles', () => {
    expect(
      canAccess(['ERAS Professional'], ['officer', 'professional'], roleNames)
    ).toBe(true);
  });

  it('keeps out a user who has none of the required roles', () => {
    expect(canAccess(['ERAS Professional'], ['officer'], roleNames)).toBe(
      false
    );
  });

  it('keeps out a user with no ERAS role (Guest) from a route with roles', () => {
    expect(canAccess([], ['professional'], roleNames)).toBe(false);
  });

  it('lets the Administrator pass every role check', () => {
    expect(canAccess(['ERAS Administrator'], ['officer'], roleNames)).toBe(
      true
    );
  });
});
