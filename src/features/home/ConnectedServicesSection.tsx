import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

import { HomeSection } from './HomeSection';
import { ServiceCard } from './ServiceCard';
import { useConnectedServices } from './use-connected-services';

interface ConnectedServicesSectionProps {
  /** A screen of 768px or more: the cards sit three to a row, each one third wide (design D11). */
  isWide: boolean;
}

/** Connected Services: the user's service configurations and whether each one works. */
export function ConnectedServicesSection({
  isWide,
}: ConnectedServicesSectionProps) {
  const { t } = useTranslation();
  const { services, isPending, isError } = useConnectedServices();
  return (
    <HomeSection
      title={t('home.connectedServices.title')}
      span="all"
      isLoading={isPending}
      error={isError ? t('home.connectedServices.error') : undefined}
    >
      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: isWide ? 'repeat(3, 1fr)' : '1fr',
        }}
      >
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </Box>
    </HomeSection>
  );
}
