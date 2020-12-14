import React, { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  AppBar,
  Badge,
  Button,
  Divider,
  Drawer,
  Grid,
  List,
  IconButton,
  ListItem,
  ListItemIcon, ListItemText, Toolbar } from '@material-ui/core';
import { Person as MyProfileIcon, Language as MixtapesOfTheDayIcon, Equalizer as AtmosphereSoundsIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Favorite as FavoritedMixtapesIcon, Mail as InboxIcon, PeopleAlt as FollowedUsersIcon, PersonAdd as SignUpIcon, MoodBad as NotFoundIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import CassetteTapeIcon from './icons/CassetteTapeIcon';
import SearchBar from './SearchBar';
import SearchBarDropdown from './SearchBarDropdown';
import Player from './Player';
import dashboard from '../images/dashboard.png';
import UserContext from '../contexts/UserContext';
import CurrentSongContext from '../contexts/CurrentSongContext';
import { userLogout, getUserProfilePictureUrl } from '../utils/api';


const drawerWidth = 240;
const drawerBgColor = '#6C8995';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    backgroundColor: drawerBgColor,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: '10%',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  container: {
    position: 'absolute',
    left: theme.spacing(12),
  },
  navbar: {
    backgroundColor: '#404A54',
    position: 'relative',
    top: '0',
    left: theme.spacing(7),
    width: `calc(100% - ${theme.spacing(7)}px)`,
    marginBotton: '100px'
  },
  player: {
    left: theme.spacing(7),
    width: `calc(100% - ${theme.spacing(7)}px)`,
    bottom: '0',
    position: 'relative',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    position: 'absolute',
    left: drawerWidth + 20,
  },
  icon: {
    color: 'black',
  },
}));



function PageFrame(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const { currentSong, setCurrentSong } = useContext(CurrentSongContext);

  const { user, setUser } = useContext(UserContext);

  const logout = async () => {
    await userLogout();
    history.push('/');
    setUser({ isLoggedIn: false });
  }


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [searchType, setSearchType] = useState('mixtapes');

  if (!user.isLoggedIn) {
    return (<div />);
  }
  return (
    <div style={{ position: 'relative' }}>
      <AppBar className={classes.navbar} position="static">
        <Toolbar>
          <Grid container>
            <Grid item xs={4} />
            <Grid item xs={2} />
            <Grid item xs={1}>
              <SearchBarDropdown type={searchType} setType={setSearchType} />
            </Grid>
            <Grid item xs={2} style={{ margin: 'auto' }}>
              <SearchBar searchType={searchType} />
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={1}>
              <Avatar onClick={() => history.push('/me')} alt={user.username} style={{ left: '50%', cursor: 'pointer' }} src={getUserProfilePictureUrl(user._id)} />
            </Grid>
            <Grid alignItems="center" item xs={0.5}>
              {user?.isLoggedIn ?
                <Button style={{ margin: 'auto' }} onClick={() => logout()} variant="contained">Logout</Button>
                : undefined
              }
            </Grid>
            <Grid item xs={0.5} />
          </Grid>

        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
            [classes.paper]: true,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {user?.isLoggedIn ?
            <div>
              <ListItem onClick={() => history.push('/')} button>
                <ListItemIcon>
                  <img src={dashboard} alt='logo' />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem onClick={() => history.push('/me')} button>
                <ListItemIcon>
                  <MyProfileIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem onClick={() => history.push('/mymixtapes')} button>
                <ListItemIcon>
                  <CassetteTapeIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary="My Mixtapes" />
              </ListItem>
              <ListItem onClick={() => history.push('/followedusers')} button style={user.isGuest ? { display: 'none' } : {}}>
                <ListItemIcon>
                  <FollowedUsersIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary="Followed Users" />
              </ListItem>
              <ListItem onClick={() => history.push('/favoritedmixtapes')} button style={user.isGuest ? { display: 'none' } : {}}>
                <ListItemIcon>
                  <FavoritedMixtapesIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary="Favorited Mixtapes" />
              </ListItem>
              <ListItem onClick={() => history.push('/inbox')} button style={user.isGuest ? { display: 'none' } : {}}>
                <ListItemIcon>
                  <Badge badgeContent={user.inboxMessages.length} color="error">
                    <InboxIcon className={classes.icon} />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Inbox" />
              </ListItem>
              <ListItem onClick={() => history.push('/mixtapesoftheday')} button style={user.isGuest ? { display: 'none' } : {}}>
                <ListItemIcon>
                  <MixtapesOfTheDayIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary="Mixtapes of the Day" />
              </ListItem>
            </div>
            : undefined}
          <ListItem onClick={() => history.push('/atmosphere')} button>
            <ListItemIcon>
              <AtmosphereSoundsIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Atmosphere Sounds" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <AppBar style={{ backgroundColor: '#fff', display: currentSong ? '' : 'none', top: 'auto', bottom: 0, }}>
        {currentSong.listeningRoom ? undefined : <Player />}
      </AppBar>
    </div>
  );
}

export default PageFrame;
