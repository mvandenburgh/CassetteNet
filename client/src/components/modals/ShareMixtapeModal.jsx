import React, { useState } from 'react';
import { Backdrop, Modal, Fade, Grid, Typography, Button } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { EmailIcon, EmailShareButton } from 'react-share';
import { getMixtapeUrl } from '../../utils/api';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function ShareMixtapeModal(props) {
    const classes = useStyles();

    const { open, setOpen, mixtape } = props;

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
                <Grid container justify="center" alignContent="center" style={{ backgroundColor: blueGrey[400], height: '70%', width: '60%' }}>
                    <div style={{margin: '1px'}}>
                        <Typography variant="h3">Share Mixtape</Typography>
                        <EmailShareButton
                            url={getMixtapeUrl(mixtape._id)}
                            subject="Check out this mixtape!"
                            body="Come listen to this awesome mixtape on CassetteNet!"
                        >
                            <Button variant="contained" startIcon={<EmailIcon />}>EMAIL</Button>
                        </EmailShareButton>
                    </div>
                </Grid>
            </Fade>
        </Modal>
    )
}

export default ShareMixtapeModal;
