import React, { useState } from 'react';
import { Backdrop, Modal, Fade, Grid, Typography, Button } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { TwitterShareButton, TwitterIcon, FacebookIcon, FacebookShareButton, EmailIcon, EmailShareButton } from 'react-share';
import { getMixtapeUrl } from '../../utils/api';
import * as clipboard from "clipboard-polyfill/text";


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
    function copyToClipBoard(){
        clipboard.writeText(getMixtapeUrl(mixtape._id)).then(
            function(){
                
                alert("Link has been copied to the clipboard");
            },
            function(){
                console.log("error");
            }
        );
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
                <Grid container justify="center" alignContent="center" style={{ backgroundColor: blueGrey[400], height: '70%', width: '60%' }}>
                    <div style={{margin: '1px'}}>
                        <Typography variant="h3">Share Mixtape</Typography>
                        <Grid container>
                            <Grid item xs={3}>
                                <EmailShareButton
                                url={getMixtapeUrl(mixtape?._id)}
                                subject="Check out this mixtape!"
                                body="Come listen to this awesome mixtape on CassetteNet!"
                                >
                                    <Button variant="contained" startIcon={<EmailIcon />}>EMAIL</Button>
                                </EmailShareButton>
                            </Grid>
                            <Grid item xs={5}>
                                <FacebookShareButton
                                    url={getMixtapeUrl(mixtape?._id)}
                                    quote= "Checkout this mixtape!"
                                >
                                    <Button variant="contained" startIcon={<FacebookIcon />}>Share on Facebook</Button>
                                </FacebookShareButton>

                            </Grid>
                        
                            <Grid item xs={4}>
                                <TwitterShareButton
                                    url={getMixtapeUrl(mixtape?._id)}
                                    title= "Checkout this mixtape!"
                                >
                                    <Button variant="contained" startIcon={<TwitterIcon />}>Share on Twitter</Button>
                                </TwitterShareButton>   
                        
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12}> <p></p> </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <Button variant="contained" onClick={copyToClipBoard} startIcon={<FileCopyIcon />}>Copy link of mixtape To clipboard!</Button>
                        
                            </Grid>
                        
                        </Grid>

                    </div>
                </Grid>
            </Fade>
        </Modal>
    )
}

export default ShareMixtapeModal;
