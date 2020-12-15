import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress, Backdrop, Modal, Fade, Grid, Typography, Button } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { adminFillDatabase } from '../../utils/api';
import { deleteUser } from '../../utils/api';
import UserContext from '../../contexts/UserContext';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function AdminFillConfirmationModal({usersToGenerate, disabled, setDisabled, loading, setLoading, open, setOpen}) {
    const classes = useStyles();

    const fillDatabaseHandler = async () => {
        setDisabled(true);
        setLoading(true);
        await adminFillDatabase(usersToGenerate);
        setLoading(false);
        setDisabled(false);
        
        setOpen(false);
    }

    const theme = createMuiTheme({
        palette: {
          primary: green,
        },
      });
    

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
                    {loading? 
                    <div>
                        <Typography variant="h5">Filling the database...</Typography>
                        <CircularProgress color="inherit" size={20} />
                    </div>
                    :   
                    <div>
                        <Typography variant="h5">Are you sure you want to fill the database with data?</Typography>
                    
                    <br/>
                    <Grid container justify="right" alignContent="right" style={{ backgroundColor: blueGrey[400], height: '20%', width: '100%' }}>
                    
                    <Grid item xs={3}/>
                    <Grid item xs={3}> 
                            <Button onClick={fillDatabaseHandler}  variant="contained">Yes</Button> 
                    </Grid>
                    <Grid item xs={3}>
                        <Button onClick={()=> setOpen(false)} variant="contained">No</Button>
                    </Grid>
                    </Grid>
                    </div>
                    }
                            
                   
                </Grid>
            </Fade>
        </Modal>
    )
}

export default AdminFillConfirmationModal;
