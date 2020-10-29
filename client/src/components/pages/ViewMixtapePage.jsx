import React, { useState } from 'react';
import { Box, Checkbox, Fab, Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core';
import Mixtape from '../Mixtape';
import { getMixtape, getUsername } from '../../utils/api';
import { Comment as CommentIcon, Favorite as FavoriteIcon, Share as ShareIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player';

function ViewMixtapePage(props) {
    const history = useHistory();
    const goBack = () => { history.push('/') }

    const mixtape = getMixtape(props.match.params.id);
    const owner = mixtape.collaborators.filter(c => c.permissions === 'owner').map(c => c.user)[0];

    const [isEditing, setIsEditing] = useState(false);

    return (
        <div>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
                
            <br/>
            
            <Paper style={{height: '7em', padding: '1%', marginLeft: '5%', marginBottom: '2%', width: '50%'}}>
                {/* {isEditing ? <TextField value={mixtape.name} /> : <h1>{mixtape.name || 'Mixtape Title'}</h1>} */}
                <Typography variant="h2">{mixtape.name}</Typography>
                <div>
                    <h4 style={{display: 'inline-block'}}>{`Created by ${getUsername(owner)} ${mixtape.songs.length} songs, XX mins`}</h4>
                    <div style={{display: 'inline-block', float: 'right'}}>
                        <FavoriteIcon style={{margin: '10px'}}/> 
                        <CommentIcon style={{margin: '10px'}}/> 
                        <ShareIcon style={{margin: '10px'}}/>
                    </div>
                </div>
            </Paper>
            <Grid container justify="center">
                    <Mixtape enableEditing={true} isEditing={isEditing} setIsEditing={setIsEditing} id={props.match.params.id} />
            </Grid>
        </div>
    )
}

export default ViewMixtapePage;
