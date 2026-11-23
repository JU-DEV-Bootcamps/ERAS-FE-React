import type { TFunction } from 'i18next';

const MINUTE_SECONDS = 60;
const HOUR_SECONDS = 3600;

/**
 * When the key figures were loaded, as v2 shows it: "Just Now" under 10 seconds, "<n>s ago" under a minute,
 * "<n>m ago" under an hour, and the time of day in the user's language after that (design D8).
 */
export function formatLastUpdated(
  loadedAt: number,
  now: number,
  t: TFunction,
  language: string
): string {
  const seconds = Math.floor((now - loadedAt) / 1000);
  if (seconds < 10) return t('home.overview.justNow');
  if (seconds < MINUTE_SECONDS)
    return t('home.overview.secondsAgo', { count: seconds });
  if (seconds < HOUR_SECONDS)
    return t('home.overview.minutesAgo', {
      count: Math.floor(seconds / MINUTE_SECONDS),
    });
  return new Intl.DateTimeFormat(language, { timeStyle: 'short' }).format(
    loadedAt
  );
}
