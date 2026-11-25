import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { canAccess, type RoleKey } from '../../core/auth/access';
import type { AppRoute } from '../routing/routes';
import { useSession } from '../session';

/** An open route is listed for the three ERAS roles only, as v2's requiredRoles do (design D2). */
const ERAS_ROLES: readonly RoleKey[] = [
  'administrator',
  'officer',
  'professional',
];

interface SideMenuProps {
  routes: readonly AppRoute[];
}

/** The side menu: the ERAS logo and one entry per screen the user may open (spec app-shell). */
export function SideMenu({ routes }: SideMenuProps) {
  const { t } = useTranslation();
  const { roles, roleNames } = useSession();
  const entries = routes.filter(
    route =>
      route.menu !== undefined &&
      canAccess(
        roles,
        route.roles.length > 0 ? route.roles : ERAS_ROLES,
        roleNames
      )
  );
  return (
    <Box component="nav" aria-label={t('shell.menuLabel')}>
      <Box sx={{ p: theme => theme.palette.labels.shell.menu.logoPadding }}>
        <Box
          component="img"
          src="/eras-logo.svg"
          alt={t('shell.logoAlt')}
          sx={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </Box>
      <Divider
        sx={{
          mx: 4,
          mb: 3,
          borderColor: theme => theme.palette.labels.shell.menu.divider,
        }}
      />
      <List disablePadding>
        {entries.map(route => {
          const menu = route.menu;
          if (!menu) return null;
          const Icon = menu.icon;
          return (
            <ListItemButton
              key={route.path}
              component={NavLink}
              to={route.path}
              sx={theme => {
                const menu = theme.palette.labels.shell.menu;
                return {
                  width: menu.itemWidth,
                  height: menu.itemHeight,
                  mx: 'auto',
                  mb: 1,
                  borderRadius: menu.itemRadius,
                  color: menu.text,
                  '&:hover': { bgcolor: menu.hover },
                  '&.active': { bgcolor: menu.active },
                };
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <Icon aria-hidden />
              </ListItemIcon>
              <ListItemText
                primary={t(menu.labelKey)}
                slotProps={{
                  primary: {
                    sx: theme => ({
                      fontSize: theme.palette.labels.shell.menu.fontSize,
                      fontWeight: theme.palette.labels.shell.menu.fontWeight,
                    }),
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
