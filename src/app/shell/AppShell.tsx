import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import type { AppRoute } from '../routing/routes';
import { AppHeader } from './AppHeader';
import { SideMenu } from './SideMenu';

interface AppShellProps {
  /** The screens of v3; the side menu lists the ones that declare a menu entry. */
  routes: readonly AppRoute[];
}

/**
 * The frame around every screen: the side menu, the header and the current screen (design D1). From 768px the side
 * menu stays beside the content; below, it is hidden and opens over the content (design D3).
 */
export function AppShell({ routes }: AppShellProps) {
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up('sm'));
  const location = useLocation();
  // The location at which the menu was opened: picking an entry changes the location, which closes it (design D3).
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const menuOpen = openedAt === location.key;
  const drawerPaper = {
    width: theme.spacing(65),
    boxSizing: 'border-box',
    bgcolor: theme.palette.labels.shell.menu.background,
    borderRight: 'none',
  } as const;
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isWide ? (
        <Drawer
          variant="permanent"
          sx={{
            width: theme.spacing(65),
            flexShrink: 0,
            '& .MuiDrawer-paper': drawerPaper,
          }}
        >
          <SideMenu routes={routes} />
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={menuOpen}
          onClose={() => {
            setOpenedAt(null);
          }}
          sx={{ '& .MuiDrawer-paper': drawerPaper }}
        >
          <SideMenu routes={routes} />
        </Drawer>
      )}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppHeader
          isWide={isWide}
          onOpenMenu={() => {
            setOpenedAt(location.key);
          }}
        />
        <Outlet />
      </Box>
    </Box>
  );
}
