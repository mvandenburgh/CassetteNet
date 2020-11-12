import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, IconButton, Typography } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import MixtapeList from '../MixtapeList';
import UserContext from '../../contexts/UserContext';
import { getFavoritedMixtapes } from '../../utils/api';
import { useHistory } from 'react-router-dom';

function FavoritedMixtapesPage(props) {
    let { user, setUser } = useContext(UserContext);
    if (!user.isLoggedIn) {
        user = JSON.parse(localStorage.getItem('user'));
    }
    const [mixtapes, setMixtapes] = useState(null);
    const { _id } = user;
    useEffect(() => {
        async function getMixtapes() {
            const updatedMixtapes = await getFavoritedMixtapes(_id);           
            if (!updatedMixtapes) {
                setMixtapes([]);
            } else {
                setMixtapes(updatedMixtapes);
            }
        }
        getMixtapes();
     }, []);

    const history = useHistory();
    const goBack = () => history.goBack();

    if (!mixtapes) {
        return null;
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
                <Typography variant="h2">Favorited Mixtapes</Typography>
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
        </div>
    )
}

export default FavoritedMixtapesPage;
