import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';

import { HomeSection } from './HomeSection';
import { isRefusedToGuest } from './refused-to-guest';
import { riskKey, statusKey } from './status-label';
import { useRecentAlerts } from './use-recent-alerts';

/** Where View All leads: the Recent Alerts page, which a later change ports to v3 (spec AC-12). */
export const ALL_ALERTS_PATH = '/recent-alerts';

interface RecentAlertsSectionProps {
  /** A screen of 768px or more: the section spans two of the three columns. */
  isWide: boolean;
  /** The user has no ERAS role: a refusal of the backend leaves the section empty (design D12). */
  isGuest: boolean;
}

/** Recent Alerts: the five most recent student alerts. */
export function RecentAlertsSection({
  isWide,
  isGuest,
}: RecentAlertsSectionProps) {
  const { t, i18n } = useTranslation();
  const alerts = useRecentAlerts();
  const date = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' });
  return (
    <HomeSection
      title={t('home.recentAlerts.title')}
      span={isWide ? 2 : 1}
      asCard
      isLoading={alerts.isPending}
      error={
        alerts.isError && !isRefusedToGuest(alerts.error, isGuest)
          ? t('home.recentAlerts.error')
          : undefined
      }
      action={
        <Link
          component={RouterLink}
          to={ALL_ALERTS_PATH}
          variant="body2"
          underline="none"
          color="text.secondary"
        >
          {t('home.recentAlerts.viewAll')}
        </Link>
      }
    >
      {alerts.data?.items.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            py: 4,
          }}
        >
          <RunningWithErrorsIcon aria-hidden />
          <Typography variant="body1">
            {t('home.recentAlerts.empty')}
          </Typography>
        </Box>
      )}
      {alerts.data && alerts.data.items.length > 0 && (
        // A narrow screen scrolls the table, never the page (design D7).
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('home.recentAlerts.studentId')}</TableCell>
                <TableCell>{t('home.recentAlerts.studentName')}</TableCell>
                <TableCell>{t('home.recentAlerts.riskLevel')}</TableCell>
                <TableCell>{t('home.recentAlerts.category')}</TableCell>
                <TableCell>{t('home.recentAlerts.date')}</TableCell>
                <TableCell>{t('home.recentAlerts.status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.data.items.map((alert, index) => {
                const risk = riskKey(alert.riskLevel);
                const status = statusKey(alert.status);
                return (
                  <TableRow key={`${alert.studentId}-${String(index)}`}>
                    <TableCell>{alert.studentId}</TableCell>
                    <TableCell>{alert.studentName}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          risk === 'default'
                            ? alert.riskLevel
                            : t(`home.recentAlerts.risk.${risk}`)
                        }
                        sx={{
                          bgcolor: theme =>
                            theme.palette.labels.risk[risk].background,
                          color: theme => theme.palette.labels.risk[risk].text,
                        }}
                      />
                    </TableCell>
                    <TableCell>{alert.category}</TableCell>
                    <TableCell>
                      {alert.date ? date.format(new Date(alert.date)) : ''}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={t(`home.recentAlerts.statuses.${status}`)}
                        sx={{
                          bgcolor: theme =>
                            theme.palette.labels.status[status].background,
                          color: theme =>
                            theme.palette.labels.status[status].text,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </HomeSection>
  );
}
