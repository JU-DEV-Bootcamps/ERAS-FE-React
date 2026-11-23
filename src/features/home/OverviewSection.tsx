import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupsIcon from '@mui/icons-material/Groups';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatLastUpdated } from './format-last-updated';
import { HomeSection } from './HomeSection';
import { isRefusedToGuest } from './refused-to-guest';
import { KpiCard } from './KpiCard';
import { useDashboardKpis } from './use-dashboard-kpis';

interface OverviewSectionProps {
  /** A screen of 768px or more: the three figures side by side. */
  isWide: boolean;
  /** The user has no ERAS role: a refusal of the backend leaves the section empty (design D12). */
  isGuest: boolean;
}

/** The Overview: the three key figures of the period. */
export function OverviewSection({ isWide, isGuest }: OverviewSectionProps) {
  const { t, i18n } = useTranslation();
  const kpis = useDashboardKpis();
  // The moment Home was opened: returning to Home later shows how long ago the reused figures were loaded.
  const [openedAt] = useState(() => Date.now());
  const lastUpdated = kpis.data && (
    <Chip
      size="small"
      sx={{
        bgcolor: theme => theme.palette.labels.lastUpdated.background,
        color: theme => theme.palette.labels.lastUpdated.text,
      }}
      label={t('home.overview.lastUpdated', {
        when: formatLastUpdated(
          kpis.dataUpdatedAt,
          Math.max(openedAt, kpis.dataUpdatedAt),
          t,
          i18n.language
        ),
      })}
    />
  );
  return (
    <HomeSection
      title={t('home.overview.title')}
      action={lastUpdated}
      span="all"
      isLoading={kpis.isPending}
      error={
        kpis.isError && !isRefusedToGuest(kpis.error, isGuest)
          ? t('home.overview.error')
          : undefined
      }
    >
      {kpis.data && (
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: isWide ? 'repeat(3, 1fr)' : '1fr',
          }}
        >
          <KpiCard
            title={t('home.overview.students.title')}
            tooltip={t('home.overview.students.tooltip')}
            metric={kpis.data.totalStudents}
            icon={GroupsIcon}
            tone="students"
          />
          <KpiCard
            title={t('home.overview.polls.title')}
            tooltip={t('home.overview.polls.tooltip')}
            metric={kpis.data.totalPollsAnswered}
            icon={BarChartIcon}
            tone="polls"
          />
          <KpiCard
            title={t('home.overview.evaluations.title')}
            tooltip={t('home.overview.evaluations.tooltip')}
            metric={kpis.data.totalEvaluations}
            icon={AssignmentTurnedInIcon}
            tone="evaluations"
          />
        </Box>
      )}
    </HomeSection>
  );
}
