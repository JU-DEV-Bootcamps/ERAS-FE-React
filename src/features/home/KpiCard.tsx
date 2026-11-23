import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import type { SvgIconComponent } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import type { KpiMetric } from './types';

interface KpiCardProps {
  title: string;
  /** What the figure counts, shown when the user points at or focuses its title. */
  tooltip: string;
  metric: KpiMetric;
  /** The icon on the right of the card (design D11). */
  icon: SvgIconComponent;
  /** Which soft tone of the theme the icon takes. */
  tone: 'students' | 'polls' | 'evaluations';
}

/** One key figure: its value and its change against the previous period, up for zero or more, down below zero. */
export function KpiCard({
  title,
  tooltip,
  metric,
  icon: Icon,
  tone,
}: KpiCardProps) {
  const { t, i18n } = useTranslation();
  const titleId = useId();
  const isIncrease = metric.percentageChange >= 0;
  const number = new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 2,
  });
  return (
    <Card
      component="article"
      aria-labelledby={titleId}
      elevation={1}
      sx={{
        p: 8,
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          id={titleId}
          variant="overline"
          component="h3"
          sx={{ color: 'text.secondary', display: 'block' }}
        >
          <Tooltip title={tooltip} describeChild>
            <Box component="span" tabIndex={0}>
              {title}
            </Box>
          </Tooltip>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 3, mt: 2 }}>
          <Typography
            variant="h1"
            component="p"
            sx={{ fontWeight: 'fontWeightBold' }}
          >
            {number.format(metric.value)}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: isIncrease ? 'success.main' : 'error.main',
            }}
          >
            {isIncrease ? (
              <ArrowUpwardIcon
                fontSize="inherit"
                titleAccess={t('home.overview.increase')}
              />
            ) : (
              <ArrowDownwardIcon
                fontSize="inherit"
                titleAccess={t('home.overview.decrease')}
              />
            )}
            <Typography variant="body1" component="span">
              {`${number.format(Math.abs(metric.percentageChange))}%`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Icon
        aria-hidden
        sx={{
          fontSize: theme => theme.spacing(16),
          color: theme => theme.palette.labels.kpi[tone],
          flexShrink: 0,
        }}
      />
    </Card>
  );
}
