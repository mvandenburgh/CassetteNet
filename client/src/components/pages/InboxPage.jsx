import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Box, Divider, Grid, IconButton, List, ListItem, ListItemText, ListItemAvatar, Typography } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import UserContext from '../../contexts/UserContext';
import { getInboxMessages } from '../../utils/api';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: blueGrey[900], // '#3E3285',
  },
  inline: {
    display: 'inline',
  },
}));

function InboxPage() {
    const classes = useStyles();

    let { user, setUser } = useContext(UserContext);
    if (!user.isLoggedIn) {
        user = JSON.parse(localStorage.getItem('user'));
    }

    const messages = getInboxMessages(user._id);

    const history = useHistory();
    const goBack = () => { history.push('/') }

    return (
        <div style={{color: 'white', left:0}}>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
                
            <br/>
            <br/>
            <Grid container align="center" justify="center">
                <Typography variant="h2">Inbox</Typography>
            </Grid>
            <Grid container align="center" justify="center">
            <Box style={{display: 'inline-flex', 
                        flexDirection: 'row', 
                        backgroundColor: blueGrey[900], 
                        marginRight: '10px',
                        marginBottom: '30px',
                        paddingLeft: '20px',
                        paddingTop: '20px',  
                        paddingBottom: '20px',
                        width: '85%', 
                        height: '30%'}} boxShadow={3} borderRadius={12}>
                    <List subheader={<li />} className={classes.root}>
                    <ListItem alignItems="flex-start">                
                    <ListItemText
                        style={{marginRight: '10%'}}
                        primary={
                            <React.Fragment>
                                From
                            </React.Fragment>
                        }
                        />
                        <ListItemText
                        style={{marginRight: '10%'}}
                        primary={
                            <React.Fragment>
                                Message
                            </React.Fragment>
                        }
                        />
                        <ListItemText
                        primary={
                            <React.Fragment>
                                Mixtape
                            </React.Fragment>
                        }
                        />
                    </ListItem>
                    <hr />
                        {
                            messages.map((message) => {
                                return (
                                    <div>
                                        <ListItem alignItems="flex-start">
                                            <Grid container>
                                                <Grid item xs={4}>
                                                    <ListItemAvatar>
                                                        <Avatar alt={message.sender} src="/static/images/avatar/1.jpg" />
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            className={classes.inline}
                                                        >
                                                            {message.sender}
                                                            </Typography>
                                                    </ListItemAvatar>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ListItemText
                                                    primary={
                                                        <React.Fragment>
                                                        {message.message}
                                                        </React.Fragment>
                                                    }
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <img style={{width: '20%'}} src="https://thumbs.dreamstime.com/b/retro-mix-tape-cover-illustration-retro-mix-tape-cover-illustration-old-school-music-art-182730287.jpg" alt="mixtape_cover"></img>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <Divider variant="inset" style={{marginRight: '10%'}} component="li" />
                                    </div>
                                );
                            })
                        }
                    </List>
                </Box>
            </Grid>
        </div>
  );
}

export default InboxPage;
