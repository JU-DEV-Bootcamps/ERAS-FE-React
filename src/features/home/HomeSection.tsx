import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface HomeSectionProps {
  title: string;
  /** Shown at the end of the title row, such as the "Last Updated" chip or the "View All" link. */
  action?: ReactNode;
  /** The section's data is still loading: a loading indicator replaces its content (A3). */
  isLoading?: boolean;
  /** The section's data could not be loaded: this message replaces its content, the other sections stay (A4). */
  error?: string | undefined;
  /** How many columns of the Home grid the section spans; "all" spans the whole row. */
  span?: 1 | 2 | 'all';
  /** Draws the whole section, title included, inside a white card, as v2 does for Recent Alerts (design D11). */
  asCard?: boolean;
  children?: ReactNode;
}

/** One section of Home: a titled region that loads and fails on its own. */
export function HomeSection({
  title,
  action,
  isLoading = false,
  error,
  span = 1,
  asCard = false,
  children,
}: HomeSectionProps) {
  const { t } = useTranslation();
  let content = children;
  if (error) {
    content = <Alert severity="error">{error}</Alert>;
  } else if (isLoading) {
    content = <CircularProgress aria-label={t('home.loading')} />;
  }
  const header = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      <Typography variant={asCard ? 'h3' : 'h2'} component="h2">
        {title}
      </Typography>
      {action}
    </Box>
  );
  return (
    <Box
      component="section"
      aria-label={title}
      sx={{
        minWidth: 0,
        gridColumn: span === 'all' ? '1 / -1' : `span ${String(span)}`,
      }}
    >
      {asCard ? (
        <Card elevation={1} sx={{ p: 6, borderRadius: 1.5 }}>
          {header}
          {content}
        </Card>
      ) : (
        <>
          {header}
          {content}
        </>
      )}
    </Box>
  );
}
