import React from 'react';
import { Grid, IconButton, Paper } from '@material-ui/core';
import Mixtape from '../Mixtape';
import { getMixtape, getUsername } from '../../utils/api';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

function ViewMixtapePage(props) {
    const history = useHistory();
    const goBack = () => { history.push('/') }

    const mixtape = getMixtape(props.match.params.id);
    const owner = mixtape.collaborators.filter(c => c.permissions === 'owner').map(c => c.user)[0];
    return (
        <div style={{paddingTop: '1em'}}>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
                
            <br/>
            
            <Paper style={{padding: '1%', marginLeft: '5%', marginBottom: '5%', width: '50%'}}>
                <h1>{mixtape.name || 'Mixtape Title'}</h1>
                <h4>{`Created by ${getUsername(owner)} ${mixtape.songs.length} songs, XX mins`}</h4>
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
