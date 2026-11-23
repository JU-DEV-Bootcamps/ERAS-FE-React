import type { i18n } from 'i18next';
import { beforeAll, describe, expect, it } from 'vitest';

import { initI18n } from '../../core/i18n/i18n';
import { formatLastUpdated } from './format-last-updated';

const loadedAt = new Date('2026-11-20T10:00:00Z').getTime();
const SECOND = 1000;

let translations: i18n;
beforeAll(async () => {
  translations = await initI18n();
});

function label(elapsedMs: number) {
  return formatLastUpdated(
    loadedAt,
    loadedAt + elapsedMs,
    translations.t,
    'en'
  );
}

describe('formatLastUpdated', () => {
  it('says Just Now under 10 seconds', () => {
    expect(label(0)).toBe('Just Now');
    expect(label(3 * SECOND)).toBe('Just Now');
    expect(label(9 * SECOND)).toBe('Just Now');
  });

  it('counts seconds under a minute', () => {
    expect(label(10 * SECOND)).toBe('10s ago');
    expect(label(59 * SECOND)).toBe('59s ago');
  });

  it('counts minutes under an hour', () => {
    expect(label(60 * SECOND)).toBe('1m ago');
    expect(label(3599 * SECOND)).toBe('59m ago');
  });

  it('gives the time of day after an hour', () => {
    const expected = new Intl.DateTimeFormat('en', {
      timeStyle: 'short',
    }).format(loadedAt);
    expect(label(3600 * SECOND)).toBe(expected);
  });
});
