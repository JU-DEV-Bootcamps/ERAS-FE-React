import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSession } from '../session';
import { roleLabelKey } from './role-label';

/** The user menu of the header: the user's name and role, and "Log out" (design D5). */
export function UserMenu() {
  const { t } = useTranslation();
  const { userName, roles, roleNames, logout } = useSession();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const menuId = useId();
  return (
    <>
      <IconButton
        aria-label={t('shell.userMenu')}
        aria-controls={anchor ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={anchor ? 'true' : undefined}
        onClick={event => {
          setAnchor(event.currentTarget);
        }}
        sx={theme => {
          const header = theme.palette.labels.shell.header;
          return {
            width: header.avatarSize,
            height: header.avatarSize,
            p: 0,
            overflow: 'hidden',
            bgcolor: header.icon,
            // v2's .main-button: the picture sits on the bottom edge of the circle, centred.
            alignItems: 'flex-end',
            '&:hover': { bgcolor: header.icon },
          };
        }}
      >
        <Box
          component="img"
          src="/user-avatar.svg"
          alt=""
          aria-hidden
          sx={theme => ({
            display: 'block',
            width: theme.palette.labels.shell.header.avatarImageWidth,
            height: theme.palette.labels.shell.header.avatarImageHeight,
          })}
        />
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchor}
        open={anchor !== null}
        onClose={() => {
          setAnchor(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ px: 4, py: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'fontWeightMedium' }}>
            {userName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t(roleLabelKey(roles, roleNames))}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchor(null);
            void logout();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {t('shell.logout')}
        </MenuItem>
      </Menu>
    </>
  );
}
