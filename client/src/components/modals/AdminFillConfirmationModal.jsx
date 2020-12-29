import React from 'react';
import { CircularProgress, Backdrop, Modal, Fade, Grid, Typography, Button } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { adminFillDatabase } from '../../utils/api';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function AdminFillConfirmationModal({ usersToGenerate, disabled, setDisabled, loading, setLoading, open, setOpen }) {
    const classes = useStyles();

    const fillDatabaseHandler = async () => {
        setDisabled(true);
        setLoading(true);
        await adminFillDatabase(usersToGenerate);
        setLoading(false);
        setDisabled(false);

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
                    {loading ?
                        <div>
                            <Typography variant="h5">Filling the database...</Typography>
                            <CircularProgress color="inherit" size={20} />
                        </div>
                        :
                        <Grid>
                            <Typography variant="h5" style={{padding: '10px'}}>Are you sure you want to fill the database with data?</Typography>

                            <br />
                            <Grid container justify="center" alignContent="center" style={{ backgroundColor: blueGrey[400], height: '20%', width: '100%' }}>
                                <Grid item align="center" style={{textAlign: 'center'}} xs={5}>
                                    <Button onClick={fillDatabaseHandler} variant="contained">Yes</Button>
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

export default AdminFillConfirmationModal;
