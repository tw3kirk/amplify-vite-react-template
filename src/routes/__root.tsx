import { Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu'
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useState } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AddCircle } from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
  }>(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  }));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    ],
  }))

const theme = createTheme({
    palette: {
        mode: 'dark'
    },
})

const NavMenu = () => {
    const [open, setOpen] = useState(false),
        navigate = useNavigate(),
        menuItems = [{
            name: 'Home',
            path: '/',
            icon: <HomeIcon/>
        },{
            name: 'About',
            path: '/about',
            icon: <InfoIcon/>
        }]

    return <>
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={() => setOpen(true)}
                    sx={[open && { display: 'none' }]}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant='h5' sx={{ml: '2em', flexGrow: 1}}>
                    SAYPO
                </Typography>
                <IconButton onClick={() => navigate({to: '/cardset/create', replace: true})}><AddCircle/></IconButton>
            </Toolbar>
            <Drawer sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }} variant="persistent" anchor="left" open={open}>
                <DrawerHeader>
                    <ListItem>
                        <ListItemButton onClick={() => setOpen(false)}>
                            <ChevronLeftIcon />
                        </ListItemButton>
                    </ListItem>
                </DrawerHeader>
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem component={Link} to={item.path}>
                            <ListItemButton onClick={() => setOpen(false)}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} sx={{color: 'white'}}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </AppBar>
        <Main open={open} sx={{ml: (open ? `${drawerWidth}px`: 0)}}>
            <DrawerHeader />
            <Outlet />
            <TanStackRouterDevtools />
        </Main>
        </ThemeProvider>
    </>
}

export const Route = createRootRoute({
  component: NavMenu
})