import React from 'react';
import { CircularProgress, Backdrop, Modal, Fade, Grid, Typography, Button } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { adminDropDatabase } from '../../utils/api';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function AdminDropConfirmationModal({ loading, setLoading, disabled, setDisabled, open, setOpen }) {
    const classes = useStyles();

    const dropDatabaseHandler = async () => {
        setDisabled(true);
        setLoading(true);
        await adminDropDatabase();
        window.location.reload();
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
                    {loading ?
                        <div>
                            <Typography variant="h5">Clearing the database...</Typography>
                            <CircularProgress color="inherit" size={20} />
                        </div>
                        :
                        <Grid container>
                            <Typography align="center" style={{ padding: '10px' }} variant="h5">Are you sure you want to drop all data in the database?</Typography>
                            <br />
                            <Grid container justify="center" alignContent="center" style={{ backgroundColor: blueGrey[400], height: '20%', width: '100%' }}>
                                <Grid item align="center" style={{textAlign: 'center'}} xs={5}>
                                    <Button onClick={dropDatabaseHandler} variant="contained">Yes</Button>
                                </Grid>
                                <Grid item xs={2} />
                                <Grid item align="center" style={{textAlign: 'center'}} xs={5}>
                                    <Button onClick={() => setOpen(false)} variant="contained">No</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    }




                </Grid>
            </Fade>
        </Modal>
    )
}

export default AdminDropConfirmationModal;
