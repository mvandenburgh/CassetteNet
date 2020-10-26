import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';
import { AppBar, Badge, Typography, InputBase, Divider, Drawer, List, IconButton, ListItem, ListItemIcon, ListItemText, Toolbar } from '@material-ui/core';
import { Search as SearchIcon, Language as AnonymousMixtapesIcon, Equalizer as AtmosphereSoundsIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Favorite as FavoritedMixtapesIcon, Mail as InboxIcon, PeopleAlt as FollowedUsersIcon, PersonAdd as SignUpIcon, MoodBad as NotFoundIcon } from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import CassetteTapeIcon from './icons/CassetteTapeIcon';
import UserContext from '../contexts/UserContext';


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
    width: theme.spacing(7),
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
  search: {
    position: 'absolute',
    right: '5%',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function PageFrame(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  // TODO: add setUser to destructuring when needed
    // Removed for now to avoid build warnings
  const { user } = useContext(UserContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  if (props.invisible) {
    return (<div />);
  }
  return (
    <div style={{position: 'relative'}}>
      <AppBar className={classes.navbar} position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            {user.username} {/* TODO: get from dummy data */ }
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
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
                  {/* <Link to="/mymixtapes"> */}
                    <ListItem onClick={() => history.push('/mymixtapes')} button style={user.isGuest ? {display: 'none'} : {}}>
                      <ListItemIcon>
                          <CassetteTapeIcon />    
                      </ListItemIcon>
                      <ListItemText primary="My Mixtapes" />
                    </ListItem>
                  {/* </Link> */}
                  <Link to="/atmosphere">
                      <ListItem button>
                          <ListItemIcon>
                              <AtmosphereSoundsIcon />    
                          </ListItemIcon>
                          <ListItemText primary="Atmosphere Sounds" />
                      </ListItem>
                    </Link>
                    <Link to="/NotFound">
                      <ListItem button>
                          <ListItemIcon>
                              <NotFoundIcon />    
                          </ListItemIcon>
                          <ListItemText primary="Page Not Found" />
                      </ListItem>
                    </Link>
                    <Link to="/SignUp">
                      <ListItem button>
                          <ListItemIcon>
                              <SignUpIcon />    
                          </ListItemIcon>
                          <ListItemText primary="Sign Up" />
                      </ListItem>
                    </Link>
                  <ListItem button style={user.isGuest ? {display: 'none'} : {}}>
                      <ListItemIcon>
                          <FollowedUsersIcon />    
                      </ListItemIcon>
                      <ListItemText primary="Followed Users" />
                  </ListItem>
                  <ListItem button style={user.isGuest ? {display: 'none'} : {}}>
                      <ListItemIcon>
                          <FavoritedMixtapesIcon />    
                      </ListItemIcon>
                      <ListItemText primary="Favorited Mixtapes" />
                  </ListItem>
                  <Link to="/inbox">
                    <ListItem button style={user.isGuest ? {display: 'none'} : {}}>
                        <ListItemIcon>
                            {/* TODO: get actual number of messages in inbox */}
                            <Badge badgeContent={4} color="error">
                              <InboxIcon />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItem>
                  </Link>
                  <ListItem button style={user.isGuest ? {display: 'none'} : {}}>
                      <ListItemIcon>
                          <AnonymousMixtapesIcon />    
                      </ListItemIcon>
                      <ListItemText primary="Anonymous Mixtapes" />
                  </ListItem>
                </List>
            <Divider />
        </Drawer>
    </div>
  );
}

export default PageFrame;
