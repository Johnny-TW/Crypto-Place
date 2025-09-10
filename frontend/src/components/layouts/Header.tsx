import React from 'react';
import * as MUI from '@mui/material';
import { Inbox as InboxIcon, Mail as MailIcon } from '@mui/icons-material';
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import '../../styles/layouts/Navbar.scss';

interface LinkItem {
  name: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

interface DrawerListProps {
  mainList: string[];
  informationList: string[];
  mainLinkMap: Record<string, string>;
  linkMap: Record<string, string>;
  onClose: () => void;
}

interface ButtonAppBarState {
  open: boolean;
  anchorElUser: HTMLElement | null;
}

const ButtonAppBar: React.FC = () => {
  const [state, setState] = React.useState<ButtonAppBarState>({
    open: false,
    anchorElUser: null,
  });

  const toggleDrawer = (newOpen: boolean) => (): void => {
    setState(prevState => ({ ...prevState, open: newOpen }));
  };

  // Sidebar list * main
  const mainList: string[] = ['Home', 'NFT Dashboard', 'Crypto News'];

  // Sidebar list * others
  const informationList: string[] = [
    'Team Roster',
    'Project Information',
    'User Guide',
  ];

  const settings: string[] = ['Profile', 'Account', '11003736', 'Logout'];

  // sidebar link
  const linkMap: Record<string, string> = {
    'Project Information': '/project-information',
    'User Guide': '/user-guide',
    'Team Roster': 'https://enbgworkplace.wistron.com/',
  };

  const mainLinkMap: Record<string, string> = {
    Home: '/',
    'NFT Dashboard': '/NFTDashboard',
    'Crypto News': '/CryptoNews',
  };

  const DrawerList: React.FC<DrawerListProps> = ({
    mainList,
    informationList,
    mainLinkMap,
    linkMap,
    onClose,
  }) => (
    <MUI.Box
      className='Sidebar'
      sx={{ width: 250 }}
      role='presentation'
      onClick={onClose}
    >
      <MUI.List>
        {mainList.map((text, index) => (
          <MUI.ListItem key={text} disablePadding>
            <MUI.ListItemButton
              component={mainLinkMap[text] ? 'a' : 'div'}
              href={mainLinkMap[text] || undefined}
            >
              <MUI.ListItemIcon className='Sidebar_list_icon'>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </MUI.ListItemIcon>
              <MUI.ListItemText primary={text} />
            </MUI.ListItemButton>
          </MUI.ListItem>
        ))}
      </MUI.List>
      <MUI.Divider />
      <MUI.List>
        {informationList.map((text, index) => (
          <MUI.ListItem key={text} disablePadding>
            <MUI.ListItemButton
              component={text === 'Team Roster' ? 'a' : 'a'}
              href={
                text === 'Team Roster' ? linkMap[text] : linkMap[text] || '#'
              }
              target={text === 'Team Roster' ? '_blank' : undefined}
              rel={text === 'Team Roster' ? 'noopener noreferrer' : undefined}
            >
              <MUI.ListItemIcon className='Sidebar_list_icon'>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </MUI.ListItemIcon>
              <MUI.ListItemText primary={text} />
            </MUI.ListItemButton>
          </MUI.ListItem>
        ))}
      </MUI.List>
    </MUI.Box>
  );

  const handleCloseUserMenu = (): void => {
    setState(prevState => ({ ...prevState, anchorElUser: null }));
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setState(prevState => ({
      ...prevState,
      anchorElUser: event.currentTarget,
    }));
  };

  return (
    <MUI.Box sx={{ flexGrow: 1 }}>
      <MUI.AppBar className='Navbar' style={{ margin: 0 }} position='fixed'>
        <MUI.Toolbar>
          <MUI.IconButton
            className='Sidebar_list_icon'
            onClick={toggleDrawer(true)}
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <Bars3Icon className='w-6 h-6' />
          </MUI.IconButton>
          <MUI.Typography
            className='Header_title'
            variant='h6'
            component='div'
            sx={{ flexGrow: 1 }}
          />
          <MUI.Drawer open={state.open} onClose={toggleDrawer(false)}>
            <DrawerList
              mainList={mainList}
              informationList={informationList}
              mainLinkMap={mainLinkMap}
              linkMap={linkMap}
              onClose={toggleDrawer(false)}
            />
          </MUI.Drawer>
          <MUI.Button
            className='Sign_button'
            color='inherit'
            onClick={handleOpenUserMenu}
          >
            Johnny Yeh
          </MUI.Button>

          <MUI.Menu
            sx={{ mt: '45px' }}
            id='menu-appbar'
            anchorEl={state.anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(state.anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map(setting => (
              <MUI.MenuItem key={setting} onClick={handleCloseUserMenu}>
                <MUI.Typography sx={{ textAlign: 'center' }}>
                  {setting}
                </MUI.Typography>
              </MUI.MenuItem>
            ))}
          </MUI.Menu>
        </MUI.Toolbar>
      </MUI.AppBar>
    </MUI.Box>
  );
};

export default ButtonAppBar;
