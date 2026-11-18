import { useTranslation } from 'react-i18next';

export function AccessDeniedPage() {
  const { t } = useTranslation();
  return (
    <main>
      <h1>{t('accessDenied.title')}</h1>
      <p>{t('accessDenied.message')}</p>
    </main>
  );
}
