import { describe, expect, it } from 'vitest';

import { en } from './en';
import { es } from './es';
import { initI18n, LANGUAGES } from './i18n';
import { ptBR } from './pt-BR';

/** Every key of a resource as a dotted path, with its text. */
function flatten(resource: object, prefix = ''): Map<string, unknown> {
  const entries = new Map<string, unknown>();
  for (const [key, value] of Object.entries(resource)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object') {
      for (const [nested, text] of flatten(value as object, path)) entries.set(nested, text);
    } else {
      entries.set(path, value);
    }
  }
  return entries;
}

const english = [...flatten(en).keys()].sort();

describe('translations', () => {
  it.each([
    ['es', es],
    ['pt-BR', ptBR],
  ])('%s has exactly the keys of English', (_language, resource) => {
    expect([...flatten(resource).keys()].sort()).toEqual(english);
  });

  it.each([
    ['en', en],
    ['es', es],
    ['pt-BR', ptBR],
  ])('%s has no empty text', (_language, resource) => {
    for (const [key, text] of flatten(resource)) {
      expect(typeof text === 'string' && text.trim() !== '', `empty text at ${key}`).toBe(true);
    }
  });

  it('offers English, neutral Spanish and Brazilian Portuguese', () => {
    expect(LANGUAGES).toEqual(['en', 'es', 'pt-BR']);
  });

  it('starts in English and falls back to English', async () => {
    const i18n = await initI18n();
    expect(i18n.language).toBe('en');
    expect(i18n.options.fallbackLng).toEqual(['en']);
    for (const language of LANGUAGES) {
      expect(i18n.hasResourceBundle(language, 'translation')).toBe(true);
    }
  });
});
