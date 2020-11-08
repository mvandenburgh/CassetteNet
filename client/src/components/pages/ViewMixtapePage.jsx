import React, { useEffect, useState } from 'react';
import {
    Button, 
    Box, 
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, 
    Fab, 
    Grid, 
    IconButton, 
    Paper, 
    TextField, 
    Typography,

 } from '@material-ui/core';
import Mixtape from '../Mixtape';
import FavoriteMixtapeButton from '../FavoriteMixtapeButton';
import { getMixtape, getUsername } from '../../utils/api';
import { Comment as CommentIcon, Share as ShareIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player';

function ViewMixtapePage(props) {
    const history = useHistory();
    const goBack = () => { history.push('/') }

    const [mixtape, setMixtape] = useState({
        name: '',
        collaborators: [],
        songs: [],
    });
    const [changeMixtapeNamePopupIsOpen, setchangeMixtapeNamePopupIsOpen] = useState(false); // whether add song popup is open
    console.log(props.match.params.id)
    useEffect(() => {
        async function updateMixtape() {
            const updatedMixtape = await getMixtape(props.match.params.id);
            setMixtape(updatedMixtape);
        }
        updateMixtape();
    }, []);
    const owner = mixtape.collaborators.filter(c => c.permissions === 'owner').map(c => c.username)[0];

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(false);

    const handleChangeMixtapeNamePopup = () => {
        setchangeMixtapeNamePopupIsOpen(!changeMixtapeNamePopupIsOpen);
      };

    const saveName = () => {
        // const newSongs = [...mixtape.songs];
        // newSongs.push(songToAdd);
        // mixtape.songs = newSongs;
        // setMixtape(mixtape);
        // setSongToAdd({});
        console.log("Save name");
        //event.stopPropagation();
        alert("Save alert!");
    }

    return (
        <div>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
                
            <br/>
            <Dialog open={changeMixtapeNamePopupIsOpen} onClose={handleChangeMixtapeNamePopup} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Change Mixtape Name</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the new name:
                        </DialogContentText>
                        <TextField
                            
                            // label="Search..."
                            variant="filled"
                            InputProps={{ style: { fontSize: '1.5em' }, disableUnderline: false, type: 'search' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button align="center" onClick={() => saveName()} color="primary">
                            Save
                        </Button>
                    </DialogActions>
            </Dialog>

            <Paper style={{height: '7em', padding: '1%', marginLeft: '5%', marginBottom: '2%', width: '70%'}}>
                {/* {isEditing ? <TextField value={mixtape.name} /> : <h1>{mixtape.name || 'Mixtape Title'}</h1>} */}
                <Grid container>
                    <Grid sz={4}>
                        
                <Typography variant="h4">{mixtape.name}</Typography>
                    </Grid>
                    <Grid sz={1}>

                        <Button onClick={handleChangeMixtapeNamePopup} startIcon={<EditIcon />}  style={{position: 'absolute'}} variant="contained">Change Mixtape Name</Button>
                    </Grid>
                

                </Grid>
                
                
                <div>
                    <h4 style={{display: 'inline-block'}}>{`Created by ${owner} ${mixtape.songs.length} songs, XX mins`}</h4>
                    <div style={{display: 'inline-block', float: 'right'}}>
                        <FavoriteMixtapeButton id={props.match.params.id} style={{margin: '7px'}}/> 
                        <CommentIcon style={{margin: '10px'}}/> 
                        <ShareIcon style={{margin: '10px'}}/>
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
