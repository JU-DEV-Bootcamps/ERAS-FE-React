import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useSession } from '../../app/session';
import { canAccess } from '../../core/auth/access';
import { ConnectedServicesSection } from './ConnectedServicesSection';
import { OverviewSection } from './OverviewSection';
import { RecentAlertsSection } from './RecentAlertsSection';

/** Home, the first screen after sign-in (spec home-overview). */
export function HomePage() {
  const { roles, roleNames } = useSession();
  // Only Administrators and Officers may read service configurations (design D5); the Administrator passes.
  const showsConnectedServices = canAccess(roles, ['officer'], roleNames);
  // One column below 768px; from 768px three columns, Recent Alerts spanning two (design D7, A6).
  const isWide = useMediaQuery(useTheme().breakpoints.up('sm'));
  // A Guest has no ERAS role; Home still opens for them, as in v2 (design D12).
  const isGuest = !canAccess(
    roles,
    ['administrator', 'officer', 'professional'],
    roleNames
  );
  return (
    <Box component="main" sx={{ p: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 6,
          gridTemplateColumns: isWide ? 'repeat(3, 1fr)' : '1fr',
        }}
      >
        <OverviewSection isWide={isWide} isGuest={isGuest} />
        <RecentAlertsSection isWide={isWide} isGuest={isGuest} />
        {showsConnectedServices && <ConnectedServicesSection isWide={isWide} />}
      </Box>
    </Box>
  );
}
