import React, { useState } from 'react';
import { Backdrop, Modal, Fade, Grid, TextField, Typography, Button, Slide, Snackbar } from '@material-ui/core';
import { Edit as EditIcon, YouTube as YouTubeIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { createMixtape, getExternalPlaylist } from '../../utils/api';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function CreateMixtapeModal({ open, setOpen }) {
    const classes = useStyles();

    const history = useHistory();

    const createNewMixtape = () => {
        createMixtape().then(newMixtape => history.push(`/mixtape/${newMixtape.data._id}`));
    };

    const [page, setPage] = useState('main');

    const [youtubePlaylistLink, setYoutubePlaylistLink] = useState('');

    const [invalidLink, setInvalidLink] = useState(false);

    const importPlaylist = () => {
        getExternalPlaylist(page, youtubePlaylistLink)
            .then(playlist => {
                console.log(playlist)
                createMixtape(playlist).then(newMixtape => history.push(`/mixtape/${newMixtape.data._id}`));
            })
            .catch(err => setInvalidLink(true));
    }

    return (
        <Modal
            className={classes.modal}
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid container style={{ backgroundColor: blueGrey[400], height: '70%', width: '60vw', overflow: 'auto' }}>

                    <Grid item xs={3} />
                    <Grid item xs={6} style={{ backgrondColor: 'green' }}>
                        <Typography align="center" variant="h3">New Mixtape</Typography>
                        <hr />
                    </Grid>
                    <Grid item xs={3} />
                    {page === 'main' ? <>
                        <Grid item xs={12}>
                            <Typography align="center" variant="h6">Please select one of the following options:</Typography>
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={5} align="center">
                            <Button onClick={createNewMixtape} variant="contained" justify="center" style={{ width: '60%', backgroundColor: 'steelblue' }} startIcon={<EditIcon />}>CREATE FROM SCRATCH</Button>
                        </Grid>
                        <Grid item xs={5} align="center">
                            <Button onClick={() => setPage('youtube')} variant="contained" justify="center" style={{ width: '60%', backgroundColor: 'crimson' }} startIcon={<YouTubeIcon />}>IMPORT FROM YOUTUBE</Button>
                        </Grid>
                        <Grid item xs={1} />
                    </> : <>
                            <Slide direction="right" in={page === 'youtube'} mountOnEnter unmountOnExit>
                                <Grid container justify="center">
                                    <Grid item xs={12}>
                                        <Typography align="center" variant="h6">Please enter the URL of the YouTube playlist you wish to import:</Typography>
                                    </Grid>
                                    <TextField
                                        onChange={(e) => setYoutubePlaylistLink(e.target.value)}
                                        value={youtubePlaylistLink}
                                        style={{ textAlign: 'center', width: '60%' }}
                                        align="center"
                                        variant="outlined"
                                    />
                                    <Grid item xs={12}>
                                        <Button variant="contained" onClick={importPlaylist}>
                                            IMPORT
                                            </Button>
                                    </Grid>
                                </Grid>
                            </Slide>
                        </>}
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        open={invalidLink}
                        onClose={() => setInvalidLink(false)}
                        autoHideDuration={4000}
                    >
                        <Alert severity="error">Not a valid YouTube playlist URL.</Alert>
                    </Snackbar>
                </Grid>
            </Fade>
        </Modal>
    )
}

export default CreateMixtapeModal;
