import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Divider, Grid, List, ListItem, ListItemText, ListItemAvatar, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '70%',
    backgroundColor: '#3E3285',
  },
  inline: {
    display: 'inline',
  },
}));

function InboxPage() {
  const classes = useStyles();


  // TODO: move to JSON file
  const sampleMessages = [
      {
          sender: 'user1',
          message: 'Great mixtape!',
      },
      {
        sender: 'user2',
        message: 'Thanks for sharing!',
    },{
        sender: 'user3',
        message: 'You have been invited to a listening room',
    },
  ]

  return (
    <div style={{color: 'white'}}>
        <Grid container align="center" justify="center">
            <h1>Your messages</h1>
        </Grid>
        <Grid container align="center" justify="center">
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
                    sampleMessages.map((message) => {
                        return (
                            <div>
                                <ListItem alignItems="flex-start">                
                                    <ListItemAvatar style={{marginRight: '10%'}}>
                                        <Avatar alt={message.sender} src="/static/images/avatar/1.jpg" />
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                        >
                                            {message.sender}
                                            </Typography>
                                    </ListItemAvatar>
                                    <ListItemText
                                    style={{marginRight: '10%'}}
                                    primary={
                                        <React.Fragment>
                                        {message.message}
                                        </React.Fragment>
                                    }
                                    />
                                    <img style={{marginLeft: '10%'}} alt="mixtape_cover"></img>
                                </ListItem>
                                <Divider variant="inset" style={{marginRight: '10%'}} component="li" />
                            </div>
                        );
                    })
                }
            </List>
        </Grid>
    </div>
  );
}

export default InboxPage;
