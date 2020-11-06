import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Box, Fab, Grid, IconButton, Typography } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import MixtapeList from '../MixtapeList';
import UserContext from '../../contexts/UserContext';
import { createMixtape, getMyMixtapes } from '../../utils/api';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    fab: {
      position: 'fixed',
      bottom: '5%',
      right: '5%',
    },
}));

function MyMixtapesPage(props) {
    const classes = useStyles();

    let { user, setUser } = useContext(UserContext);
    if (!user.isLoggedIn) {
        user = JSON.parse(localStorage.getItem('user'));
    }
    const [mixtapes, setMixtapes] = useState([]);

    const { _id } = user;
    useEffect(() => {
        async function getMixtapes() {
            const updatedMixtapes = await getMyMixtapes(_id);
            setMixtapes(updatedMixtapes);
        }
        getMixtapes();
     }, [])

    const history = useHistory();
    const goBack = () => history.push('/');

    const createNewMixtape = () => {
        createMixtape().then(newMixtape => history.push(`/mixtape/${newMixtape.data._id}`));
    }

    return (
        <div style={{ color: 'white', left: 0 }}>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
                
            <br/>
            <br/>
            <Grid container justify="center">
                <Typography variant="h2">My Mixtapes</Typography>
                <Box style={{
                            maxHeight: '60vh',
                            overflow: 'auto',
                            display: 'inline-flex', 
                            flexDirection: 'row', 
                            backgroundColor: blueGrey[900], 
                            marginRight: '10px',
                            marginBottom: '30px',
                            paddingLeft: '20px',
                            paddingTop: '20px',  
                            paddingBottom: '20px',
                            width: '85%', 
                            height: '30%'}} boxShadow={3} borderRadius={12}>
                    <Grid container justify="center">
                        <MixtapeList mixtapes={mixtapes} setMixtapes={setMixtapes} />
                    </Grid>
                </Box>
            </Grid>
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => createNewMixtape()}>
                <AddIcon />
            </Fab>
        </div>
    )
}

export default MyMixtapesPage;
