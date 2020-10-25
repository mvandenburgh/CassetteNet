import React from 'react';
import { Button, Fab, Grid } from '@material-ui/core';
import MixtapeList from '../MixtapeList';

function MyMixtapesPage(props) {
    return (
        <div>
            <Grid container justify="center">
            <h1>My Mixtapes</h1>
            </Grid>
            <Grid container justify="center">
                <Grid style={{backgroundColor: '#236067', overflow: 'auto', width: '70%', maxHeight: '80vh',}} container justify="center">
                    <MixtapeList />
                </Grid>
            </Grid>
        </div>
    )
}

export default MyMixtapesPage;
