import React, { useEffect, useState } from 'react';
import { Button, Box, Checkbox, Fab, Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core';
import Mixtape from '../Mixtape';
import FavoriteMixtapeButton from '../FavoriteMixtapeButton';
import { getMixtape, getMixtapeCoverImageUrl } from '../../utils/api';
import { Comment as CommentIcon, Share as ShareIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import MixtapeCoverImageUploadModal from '../modals/MixtapeCoverImageUploadModal';
import humanizeDuration from 'humanize-duration';

function ViewMixtapePage(props) {
    const history = useHistory();
    const goBack = () => { history.push('/') }

    const [mixtape, setMixtape] = useState({
        name: '',
        collaborators: [],
        songs: [],
        duration: 0,
    });

    const owner = mixtape.collaborators.filter(c => c.permissions === 'owner').map(c => c.username)[0];

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(false);

    const [uploadCoverImagePopup, setUploadCoverImagePopup] = useState(false);
    const [coverImageUrl, setCoverImageUrl] = useState(null);

    useEffect(() => {
        async function updateMixtape() {
            const updatedMixtape = await getMixtape(props.match.params.id);
            if (updatedMixtape.songs.length > 0) {
                updatedMixtape.duration = updatedMixtape.songs.map(song => song.duration).reduce((mixtapeDuration, songDuration) => mixtapeDuration + songDuration);
            } else {
                updatedMixtape.duration = 0;
            }
            
            setMixtape(updatedMixtape);
            setCoverImageUrl(getMixtapeCoverImageUrl(updatedMixtape._id));
        }
        updateMixtape();
    }, []);

    

    return (
        <div>
            <MixtapeCoverImageUploadModal coverImageUrl={coverImageUrl} setCoverImageUrl={setCoverImageUrl} mixtape={mixtape} setMixtape={setMixtape} open={uploadCoverImagePopup} setOpen={setUploadCoverImagePopup} />
            <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
                <ArrowBackIcon />
            </IconButton>
            <br />

            <br />

            <Paper style={{ height: '7em', padding: '1%', marginLeft: '5%', marginBottom: '2%', width: '70%' }}>
                {/* {isEditing ? <TextField value={mixtape.name} /> : <h1>{mixtape.name || 'Mixtape Title'}</h1>} */}
                <Grid style={{height: '100%', width: '100%'}} container>
                    <Grid style={{height: '100%', width: '100%'}} xs={1} item>
                        <img onClick={() => isEditing ? setUploadCoverImagePopup(true) : undefined} style={{cursor: isEditing ? 'pointer' : '', width: '80%', height: '100%', objectFit: 'contain'}} src={coverImageUrl ? coverImageUrl : ''} />
                    </Grid>
                    <Grid xs={10} item>
                        <Typography variant="h4">{mixtape.name}</Typography>
                        <br />
                        <Typography variant="h7" style={{ display: 'inline-block' }}>{`Created by ${owner} ${mixtape.songs.length} songs, ${humanizeDuration(mixtape.duration * 1000).replaceAll(',', '')}`}</Typography>
                    </Grid>
                    <Grid xs={1} item>
                        <Button startIcon={<EditIcon />} style={{ position: 'absolute' }} variant="contained">Change Mixtape Name</Button>
                    </Grid>


                </Grid>


                <div>
                    
                    <div style={{ display: 'inline-block', float: 'right' }}>
                        <FavoriteMixtapeButton id={props.match.params.id} style={{ margin: '7px' }} />
                        <CommentIcon style={{ margin: '10px' }} />
                        <ShareIcon style={{ margin: '10px' }} />
                    </div>
                </div>
            </Paper>
            <Grid container justify="center">
                <Mixtape enableEditing={true} isEditing={isEditing} setIsEditing={setIsEditing} mixtape={mixtape} setMixtape={setMixtape} />
            </Grid>
        </div>
    )
}

export default ViewMixtapePage;
