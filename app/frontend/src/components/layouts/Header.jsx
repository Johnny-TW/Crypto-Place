import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuItem from '@mui/material/MenuItem';

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { Link } from 'react-router-dom';

import '../../styles/layouts/Navbar.scss';

function ButtonAppBar() {
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const toggleDrawer = (newOpen) => () => {
    // console.log(newOpen);
    setOpen(newOpen);
  };

  // Sidebar list * main
  const Mianlist = [
    'Home',
    'NFT Dashboard',
    'Crypto News',
  ];

  // Sidebar list * others
  const MianlistInformation = [
    'Team Roster',
    'Project Information',
    'User Guide',
  ];

  const settings = [
    'Profile',
    'Account',
    '11003736',
    'Logout',
  ];

  // sidebar link
  const linkMap = {
    'Project Information': '/project-information',
    'User Guide': '/user-guide',
    'Team Roster': 'https://enbgworkplace.wistron.com/',
  };

  const MainLinkMap = {
    Home: '/',
    'NFT Dashboard': '/NFTDashboard',
    'Crypto News': '/CryptoNews',
  };

  const DrawerList = (
    <Box className="Sidebar" sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {Mianlist.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={MainLinkMap[text] ? Link : 'div'}
              to={MainLinkMap[text] || undefined}
            >
              <ListItemIcon className="Sidebar_list_icon">
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {MianlistInformation.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={text === 'Team Roster' ? 'a' : Link}
              href={text === 'Team Roster' ? linkMap[text] : undefined}
              to={text !== 'Team Roster' ? linkMap[text] || '#' : undefined}
              rel={text === 'Team Roster' ? 'noopener noreferrer' : undefined}
            >
              <ListItemIcon className="Sidebar_list_icon">
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar className="Navbar" style={{ margin: 0 }} position="fixed">
        <Toolbar>
          <IconButton
            className="Sidebar_list_icon"
            onClick={toggleDrawer(true)}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography className="Header_title" variant="h6" component="div" sx={{ flexGrow: 1 }} />
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
          <Button className="Sign_button" color="inherit" onClick={handleOpenUserMenu}>Johnny Yeh</Button>

          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ButtonAppBar;
