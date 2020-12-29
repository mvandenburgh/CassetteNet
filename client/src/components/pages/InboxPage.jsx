import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Avatar, Box, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Divider, Grid, IconButton, List, ListItem, ListItemText, ListItemAvatar, Typography
} from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { ArrowBack as ArrowBackIcon, Delete as DeleteIcon } from '@material-ui/icons';
import UserContext from '../../contexts/UserContext';
import { useHistory } from 'react-router-dom';
import parse from 'html-react-parser';
import { getUserProfilePictureUrl, deleteInboxMessage } from '../../utils/api';
import CurrentSongContext from '../../contexts/CurrentSongContext';
import PlayerAnimationContext from '../../contexts/PlayerAnimationContext';
import { motion } from 'framer-motion';

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

    const { user, setUser } = useContext(UserContext);

    const { currentSong } = useContext(CurrentSongContext);
    const { animating } = useContext(PlayerAnimationContext);

    const togglesVariants = {
        hidden: {
        scale: 1
        },
        visible: {
        scale: 1.2,
        transition: {
            yoyo: Infinity
        }
        }
    }

    const [viewMessageDialogIsOpen, setViewMessageDialogIsOpen] = useState(false); // whether add song popup is open
    const [displayedMessage, setDisplayedMessage] = useState(""); // whether add song popup is open

    const printMessage = (mmm) => {
        setViewMessageDialogIsOpen(true);
        setDisplayedMessage(mmm);
    }

    const deleteMessageHandler = (e, messageId) => {
        e.stopPropagation();
        deleteInboxMessage(messageId).then(messages => {
            const newUser = { ...user };
            newUser.inboxMessages = [...messages];
            setUser(newUser);
        });
    }

    const history = useHistory();
    const goBack = () => history.goBack();
    return (
        <div style={{ color: 'white', left: 0, marginBottom: `${currentSong.playBarHeight}px` }}>
            <IconButton color="secondary" aria-label="back" onClick={() => goBack()}>
                <ArrowBackIcon />
            </IconButton>
            <Grid container align="center" justify="center">
            {animating?
                    <motion.div variants={togglesVariants}
                    initial="hidden"
                    animate="visible">
                        <Typography variant="h2">Inbox</Typography>
                    </motion.div>
                    :
                    <div>
                        <Typography variant="h2">Inbox</Typography>
                    </div>
                }
                
            </Grid>
            <Grid container align="center" justify="center">
                <Box style={{
                    display: 'inline-flex',
                    flexDirection: 'row',
                    backgroundColor: blueGrey[900],
                    marginRight: '10px',
                    marginBottom: '30px',
                    paddingLeft: '20px',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    width: '85%',
                    height: '30%'
                }} boxShadow={3} borderRadius={12}>
                    <List subheader={<li />} className={classes.root}>
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                style={{ marginRight: '10%' }}
                                primary={
                                    <React.Fragment>
                                        From
                            </React.Fragment>
                                }
                            />
                            <ListItemText
                                style={{ marginRight: '10%' }}
                                primary={
                                    <React.Fragment>
                                        Message
                            </React.Fragment>
                                }
                            />

                        </ListItem>
                        <hr />
                        {
                            [...user.inboxMessages]?.reverse().map((message) => {
                                return (
                                    <div>
                                        <Dialog open={viewMessageDialogIsOpen} onClose={() => setViewMessageDialogIsOpen(false)}>
                                <DialogTitle>Message from {message.senderUsername}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    {<React.Fragment>
                                                        {parse(displayedMessage)}
                                                    </React.Fragment>}
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                {/* <Button align="right" color="primary">
                                                    CLOSE
                                                </Button> */}
                                            </DialogActions>
                                        </Dialog>
                                        <ListItem alignItems="flex-start" onClick={() => printMessage(message.message)}>
                                            <Grid container >
                                                <Grid item xs={4} onClick={() => history.push(`/user/${message.senderId}`)}>
                                                    <ListItemAvatar>
                                                        <Avatar alt={message.senderUsername} src={message.senderId ? getUserProfilePictureUrl(message.senderId) : '/static/images/avatar/1.jpg'} />
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            className={classes.inline}
                                                        >
                                                            {message.senderUsername}
                                                        </Typography>
                                                    </ListItemAvatar>
                                                </Grid>
                                                <Grid item xs={4} style={{ cursor: 'pointer' }}>
                                                    <Typography noWrap={true}>
                                                        {parse(message.message.replace('action="/listeningRoom/', '').replace('"><input type="submit" value="Join Listening Room" /></form>', '></form> Click for more details...'))}
                                                    </Typography>
                                                </Grid>
                                                <Grid item >
                                                    <DeleteIcon style={{ cursor: 'pointer' }} onClick={(e) => deleteMessageHandler(e, message._id)} />
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <Divider variant="inset" style={{ marginRight: '10%' }} component="li" />
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
