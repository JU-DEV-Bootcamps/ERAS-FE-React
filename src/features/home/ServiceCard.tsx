import CloudDoneIcon from '@mui/icons-material/CloudDone';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import type { ConnectedService } from './use-connected-services';

interface ServiceCardProps {
  service: ConnectedService;
}

/** One connected service: its name, provider, creator and whether its live check succeeded (design D11). */
export function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useTranslation();
  const nameId = useId();
  // No chip while the live check runs; then the colours of its result.
  const result = service.state === 'checking' ? null : service.state;
  return (
    <Card
      component="article"
      aria-labelledby={nameId}
      elevation={1}
      sx={{
        p: 8,
        borderRadius: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          mb: 5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            borderRadius: 1,
            bgcolor: theme => theme.palette.labels.service.icon.background,
            color: theme => theme.palette.labels.service.icon.text,
          }}
        >
          <CloudDoneIcon aria-hidden />
        </Box>
        {result && (
          <Chip
            size="small"
            label={t(`home.connectedServices.${result}`)}
            sx={{
              fontWeight: 'fontWeightBold',
              bgcolor: theme => theme.palette.labels.service[result].background,
              color: theme => theme.palette.labels.service[result].text,
            }}
          />
        )}
      </Box>
      <Typography
        id={nameId}
        variant="subtitle1"
        component="h3"
        sx={{ fontWeight: 'fontWeightBold' }}
      >
        {service.configurationName}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {t('home.connectedServices.provider', {
          name: service.serviceProviderName,
        })}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {t('home.connectedServices.createdBy', { name: service.createdBy })}
      </Typography>
    </Card>
  );
}
