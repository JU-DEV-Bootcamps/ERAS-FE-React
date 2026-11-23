// jsdom has no matchMedia, so MUI's useMediaQuery cannot see a screen width. setViewportWidth installs a stub
// that answers the queries theme.breakpoints.up() and down() produce: (min-width:Npx) and (max-width:Npx),
// joined with "and". Any other query throws, so a test never passes on a query the stub does not understand.
import { vi } from 'vitest';

const FEATURE = /^\(\s*(min|max)-width\s*:\s*([\d.]+)px\s*\)$/;

function matches(query: string, width: number): boolean {
  const media = query.replace(/^@media\s+/, '').trim();
  return media.split(/\s+and\s+/).every(part => {
    const found = FEATURE.exec(part.trim());
    if (!found) {
      throw new Error(`setViewportWidth cannot evaluate "${query}"`);
    }
    const limit = Number(found[2]);
    return found[1] === 'min' ? width >= limit : width <= limit;
  });
}

// Only the members MUI reads; the deprecated addListener/removeListener are left out on purpose.
/** Makes window.matchMedia answer as a screen `width` pixels wide. */
export function setViewportWidth(width: number): void {
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: matches(query, width),
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as Partial<MediaQueryList>
  );
}
