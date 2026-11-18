import { useTranslation } from 'react-i18next';

import { useSession } from '../session';

/** Placeholder home of the shell; the ERAS screens arrive with their module changes. */
export function HomePage() {
  const { t } = useTranslation();
  const { logout } = useSession();
  return (
    <main>
      <h1>{t('home.title')}</h1>
      <p>{t('home.welcome')}</p>
      <button type="button" onClick={() => void logout()}>
        {t('shell.logout')}
      </button>
    </main>
  );
}
