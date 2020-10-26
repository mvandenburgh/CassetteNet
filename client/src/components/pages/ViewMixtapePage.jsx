import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import Mixtape from '../Mixtape';

function ViewMixtapePage(props) {
    return (
        <div style={{paddingTop: '1em'}}>
            <Paper style={{padding: '1%', marginLeft: '5%', marginBottom: '5%', width: '50%'}}>
                <h1>{props.mixtapeName || 'test Mixtape'}</h1>
                <h4>{"Created by <user> X songs, XX mins"}</h4>
            </Paper>
            <Grid container justify="center">
                <Grid style={{backgroundColor: '#236067', overflow: 'auto', width: '90%', maxHeight: '80vh',}} container justify="center">
                    <Mixtape id={props.match.params.id} />
                </Grid>
            </Grid>
        </div>
    )
}

export default ViewMixtapePage;
