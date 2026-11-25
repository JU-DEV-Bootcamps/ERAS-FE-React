import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useMatches } from 'react-router';

import { useSession } from '../session';
import { roleLabelKey } from './role-label';
import { UserMenu } from './UserMenu';

function titleKeyOf(handle: unknown): string | undefined {
  if (handle !== null && typeof handle === 'object' && 'titleKey' in handle) {
    const { titleKey } = handle;
    return typeof titleKey === 'string' ? titleKey : undefined;
  }
  return undefined;
}

/** The header: the current screen's title, the signed-in user and the user menu (design D2, D4, D5). */
interface AppHeaderProps {
  /** A screen of 768px or more: no menu button, and the name and role are shown (design D3, D4). */
  isWide: boolean;
  /** Opens the side menu over the content on a small screen. */
  onOpenMenu: () => void;
}

export function AppHeader({ isWide, onOpenMenu }: AppHeaderProps) {
  const { t } = useTranslation();
  const { userName, roles, roleNames } = useSession();
  const titleKey = useMatches()
    .map(match => titleKeyOf(match.handle))
    .filter(key => key !== undefined)
    .at(-1);
  return (
    <Box
      component="header"
      sx={theme => {
        const header = theme.palette.labels.shell.header;
        return {
          display: 'flex',
          alignItems: 'center',
          gap: isWide ? 4 : 2,
          px: isWide ? 6 : 2,
          height: isWide ? header.height : header.mobileHeight,
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${header.border}`,
        };
      }}
    >
      {!isWide && (
        <IconButton
          aria-label={t('shell.openMenu')}
          onClick={onOpenMenu}
          sx={theme => ({ color: theme.palette.labels.shell.header.icon })}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Typography
        component="h1"
        noWrap
        sx={theme => ({
          flexGrow: 1,
          minWidth: 0,
          fontSize: theme.palette.labels.shell.header.titleSize,
          fontWeight: theme.palette.labels.shell.header.titleWeight,
          color: theme.palette.labels.shell.header.title,
        })}
      >
        {titleKey ? t(titleKey) : null}
      </Typography>
      {isWide && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            component="span"
            sx={theme => ({
              fontSize: theme.palette.labels.shell.header.textSize,
              fontWeight: theme.palette.labels.shell.header.nameWeight,
              color: theme.palette.labels.shell.header.name,
              textTransform: 'capitalize',
            })}
          >
            {userName}
          </Typography>
          <Typography
            component="span"
            sx={theme => ({
              fontSize: theme.palette.labels.shell.header.textSize,
              fontWeight: theme.palette.labels.shell.header.roleWeight,
              color: theme.palette.labels.shell.header.role,
            })}
          >
            {t(roleLabelKey(roles, roleNames))}
          </Typography>
        </Box>
      )}
      <UserMenu />
    </Box>
  );
}
