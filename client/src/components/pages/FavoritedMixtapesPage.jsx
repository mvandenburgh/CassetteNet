import React, { useContext, useEffect, useState } from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import MixtapeList from '../MixtapeList';
import UserContext from '../../contexts/UserContext';
import { getFavoritedMixtapes } from '../../utils/api';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

function MixtapesPage(props) {
    let { user, setUser } = useContext(UserContext);
    if (!user.isLoggedIn) {
        user = JSON.parse(localStorage.getItem('user'));
    }
    const { _id } = user;
    const mixtapes = getFavoritedMixtapes(_id);

    const history = useHistory();
    const goBack = () => { history.push('/') }

    return (
        <div>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
                
            <br/>
            <br/>
            <Grid container justify="center">
                <Typography variant="h2">Favorited Mixtapes</Typography>
            </Grid>
            <Grid container justify="center">
                <Grid style={{backgroundColor: '#236067', overflow: 'auto', width: '70%', maxHeight: '80vh',}} container justify="center">
                    <MixtapeList mixtapes={mixtapes} />
                </Grid>
            </Grid>
        </div>
    )
}

export default MixtapesPage;
