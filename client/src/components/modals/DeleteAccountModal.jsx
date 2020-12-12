import React, { useEffect, useState } from 'react';
import { Backdrop, Modal, Fade, Grid, Typography, Button } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function DeleteAccountModal(props) {
    const classes = useStyles();
    const { open, setOpen } = props;

    const theme = createMuiTheme({
        palette: {
          primary: green,
        },
      });
      const deleteAccountHandler = async () => {
        setOpen(false);
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
                <Grid container justify="center" alignContent="center" style={{ backgroundColor: blueGrey[400], height: '20%', width: '30%' }}>
                        
                            <Typography variant="h5">Are you sure you want to delete your account?</Typography>
                        <br/>
                        <Grid item xs={12}/>
                        <Grid item xs={12}/>
                        <Grid item xs={12}/>
                        <Grid item xs={2}> 
                                <Button onClick={deleteAccountHandler} color="secondary" variant="contained">Yes</Button> 
                        </Grid>
                        <Grid item xs={2}>
                            
                        <ThemeProvider theme={theme}>
                            <Button onClick={()=> setOpen(false)} color="primary" variant="contained">No</Button>
                        </ThemeProvider>
                        </Grid>
                   
                </Grid>
            </Fade>
        </Modal>
    )
}

export default DeleteAccountModal;
