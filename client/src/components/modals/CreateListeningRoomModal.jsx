import React, { useState } from 'react';
import { Box, Backdrop, Divider, Modal, Fade, Grid, Typography, Button, FormControlLabel, Switch, CircularProgress } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { createListeningRoom, getUserProfilePictureUrl } from '../../utils/api';
import UserSearchBar from '../UserSearchBar';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function CreateListeningRoomModal({ open, setOpen, mixtape }) {
    const classes = useStyles();

    const history = useHistory();

    const handleClose = () => {
        setOpen(false);
    }

    const [invitedUsers, setInvitedUsers] = useState([]);

    const [loading, setLoading] = useState(false);

    const [inviteOnly, setInviteOnly] = useState(false);

    const handleInviteUser = (user) => {
        if (!invitedUsers.includes(user) && user.username && user._id) {
            setInvitedUsers([user, ...invitedUsers]);
        }
    }

    const handleDontInviteUser = (user) => {
        setInvitedUsers(invitedUsers.filter(u => u._id !== user._id));
    }

    const createListeningRoomHandler = () => {
        setLoading(true);
        createListeningRoom(mixtape._id, !inviteOnly, invitedUsers)
            .then(listeningRoomId => history.push(`/listeningRoom/${listeningRoomId}`))
            .catch(err => alert(err));
    }

    return (
        <Modal
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid container style={{ backgroundColor: blueGrey[400], height: '70%', width: '60vw', overflow: 'auto' }}>
                    <Grid item xs={12}>
                        <Typography align="center" variant="h3">Create a Listening Room</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography align="center" variant="h6">Invite Only?</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={<Switch disabled={loading} checked={inviteOnly} onChange={() => setInviteOnly(!inviteOnly)} />}
                            label={inviteOnly ? 'Only invited users can join' : 'Anyone with the link can join'}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={6} justifyContent="center">
                        <Typography align="center" variant="h6">Send invites?:</Typography>
                        <br />
                        <UserSearchBar disabled={loading} disableClearable style={{ display: 'inline-block' }} userSelectHandler={(user) => handleInviteUser(user)} />
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={4} style={{ height: '25%', overflow: 'auto' }}>
                        <div style={{ backgroundColor: blueGrey[900] }}>
                            {invitedUsers.map((user, i) => (
                                <Box
                                    style={{
                                        margin: "5px",
                                        padding: "10px",
                                        backgroundColor: blueGrey[700],
                                        display: "flex",
                                        flexDirection: "row",
                                        borderRadius: 6,
                                        color: 'white',
                                        fontSize: '1em',
                                    }}
                                    key={i}
                                >
                                    <Grid container>
                                        <Grid item xs={1} align="left" style={{ cursor: 'pointer' }}>
                                            <img width="100%" style={{ objectFit: 'contain' }} src={getUserProfilePictureUrl(user?._id)} />
                                        </Grid>
                                        <Grid item xs={10} align="center">
                                            {user?.username}
                                        </Grid>
                                        <Grid item xs={1}>
                                            <DeleteIcon onClick={() => handleDontInviteUser(user)} />
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </div>
                    </Grid>

                    <Grid item xs={3} />
                    <Grid item xs={6}>
                        {
                            loading ?
                                <CircularProgress style={{ margin: 'auto', display: 'block' }} />
                                :
                                <Button onClick={createListeningRoomHandler} align="center" justify="center" style={{ width: '100%' }} variant="contained">Start Listening Room</Button>
                        }
                    </Grid>
                    <Grid item xs={3} />

                    {loading ? <>
                        <Grid item xs={4} />
                        <Grid item xs={4}>
                            <Typography variant="h6">One moment please while we prepare your listening room experience...</Typography>
                        </Grid>
                        <Grid item xs={4} />
                    </>
                        : undefined
                    }
                </Grid>
            </Fade>
        </Modal>
    )
}

export default CreateListeningRoomModal;
