import React, { useContext, useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import MixtapeList from '../MixtapeList';
import UserContext from '../../contexts/UserContext';
import { getMyMixtapes } from '../../utils/api';

function MyMixtapesPage(props) {
    let { user, setUser } = useContext(UserContext);
    if (!user.isLoggedIn) {
        user = JSON.parse(localStorage.getItem('user'));
    }
    const { _id } = user;
    const mixtapes = getMyMixtapes(_id);
    return (
        <div>
            <Grid container justify="center">
                <h1>My Mixtapes</h1>
            </Grid>
            <Grid container justify="center">
                <Grid style={{backgroundColor: '#236067', overflow: 'auto', width: '70%', maxHeight: '80vh',}} container justify="center">
                    <MixtapeList mixtapes={mixtapes} />
                </Grid>
            </Grid>
        </div>
    )
}

export default MyMixtapesPage;
