import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
} from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { MusicNote as MusicNoteIcon, Settings as SettingsIcon, Edit as EditIcon, PlayCircleFilledWhite as PlayIcon, Delete as DeleteIcon, AddCircle as AddIcon, Save as SaveIcon } from '@material-ui/icons';
import CurrentSongContext from '../contexts/CurrentSongContext';
import PlayingSongContext from '../contexts/PlayingSongContext';
import { getMixtape, getUsername } from '../utils/api';
import { Autocomplete } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import SettingsModal from './permissions/SettingsModal';

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: '1em',
    marginBottom: '1em',
    background: isDragging ? 'steelblue' : 'grey',
    ...draggableStyle,
});



function Mixtape(props) {
    const history = useHistory();

    const [mixtape, setMixtape] = useState(getMixtape(props.id));

    const [songsToDelete, setSongsToDelete] = useState([]);

    const { enableEditing, isEditing, setIsEditing } = props;

    const { setCurrentSong } = useContext(CurrentSongContext);

    const { playing, setPlaying } = useContext(PlayingSongContext);

    const [addSongPopupIsOpen, setAddSongPopupIsOpen] = useState(false);

    const [settingsPopupIsOpen, setSettingsPopupIsOpen] = useState(false);

    const handleAddSongPopup = () => {
      setAddSongPopupIsOpen(!addSongPopupIsOpen);
    };

    const handleSettingsPopup = () => {
      setSettingsPopupIsOpen(!settingsPopupIsOpen);
    };

    const suggestionsSongs = [
      {title: 'Watermelon Sugar', artist: 'Harry Styles' },
      {title: 'Circles', artist: 'Post Malone'},
      {title: 'Better Now', artist: 'Post Malone'},
      {title: 'Stand by Me', artist: 'Ben. E King'},
      {title: 'Sucker', artist: 'Jonas Brothers'},
      {title: 'Slow Dancing in the Dark', artist:'Joji'},
    ];

    const onDragEnd = (result) => {
      if (!result.destination) {
        return;
      }

      // set new list order
      const newSongOrder = [...mixtape.songs];
      const [removed] = newSongOrder.splice(result.source.index, 1);
      newSongOrder.splice(result.destination.index, 0, removed);
      mixtape.songs = newSongOrder;
      setMixtape(mixtape);
    };

    const playSong = (index) => {
      setPlaying(true);
      setCurrentSong({ mixtape: props.id, song: mixtape.songs[index].id })
    };

    const clickCheckbox = (songId) => {
      const toDelete = [...songsToDelete];
      if (!toDelete.includes(songId)) {
        toDelete.push(songId);
      } else {
        toDelete.splice(toDelete.indexOf(songId), 1);
      }
      setSongsToDelete(toDelete);
    };

    const deleteSongs = () => {
      // TODO: actually update database
      const newSongs = mixtape.songs.filter(song => !songsToDelete.includes(song.id));
      mixtape.songs = newSongs;
      setMixtape(mixtape);
      setSongsToDelete([]);
    }

    const settingsPopup = () => null;

    return (
      <Box style={{ display: 'inline-flex', 
                    overflow: 'auto',
                    maxHeight: '50vh',
                    flexDirection: 'row', 
                    backgroundColor: blueGrey[900],
                    marginBottom: '30px',
                    paddingTop: '20px',  
                    paddingBottom: '20px',
                    width: '90%', 
                    height: '100%' }} boxShadow={3} borderRadius={12}>

        <Dialog open={addSongPopupIsOpen} onClose={handleAddSongPopup} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add a Song!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Type the song you want to add:
            </DialogContentText>
            <Autocomplete 
              size="small"
              style={{height:35,width:300}}
              freeSolo 
              disableClearable
              options={suggestionsSongs.map((option)=>option.title)}
              renderInput={(params)=>(
                <TextField
                
                {...params}
                label="Search..."
                
                variant="outlined"
                InputProps={{ ...params.InputProps, type: 'search' }}
                />
              )}
              />
          </DialogContent>
          <DialogActions>
            <Button align="center" onClick={handleAddSongPopup} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>


        <SettingsModal mixtape={mixtape} setMixtape={setMixtape} settingsPopupIsOpen={settingsPopupIsOpen} handleSettingsPopup={handleSettingsPopup} />

        
        <Grid container justify="center">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='droppable'>
              {(provided) => (
                <List
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{width: '90%'}}
                >
                  <Toolbar style={{backgroundColor: 'black', display: enableEditing ? '' : 'none'}}>
                      {isEditing ?
                          <Grid container>
                            <Grid item xs={1}>
                                <Button startIcon={<SaveIcon />} style={{marginRight: '5%', float: 'right'}} onClick={() => setIsEditing(false)} variant="contained">DONE</Button> 
                            </Grid>
                            <Grid item xs={5} />
                            <Grid item xs={2}>
                              <Button
                                style={{marginRight: '5%', float: 'right', backgroundColor: 'green'}}
                                variant="contained"
                                color="secondary"
                                startIcon={<SettingsIcon />}
                                onClick={handleSettingsPopup}
                              >
                                Settings
                              </Button>
                            </Grid>
                            <Grid item xs={2}>
                              <Button
                                onClick={handleAddSongPopup}
                                style={{marginRight: '5%', float: 'right'}}
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                              >
                                Add a Song
                              </Button>
                            </Grid>
                            <Grid item xs={2}>
                              <Button
                                style={{display: songsToDelete.length > 0 ? '' : 'none', marginRight: '5%', float: 'right'}}
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                onClick={() => deleteSongs()}
                              >
                                Delete
                              </Button>
                            </Grid>
                          </Grid>
                        :
                          <Grid container>
                            <Button startIcon={<EditIcon />} onClick={() => setIsEditing(true)} style={{position: 'absolute', right: '5%'}} variant="contained">EDIT</Button>
                            <Button
                              style={{marginRight: '5%', float: 'right', backgroundColor: 'steelblue'}}
                              variant="contained"
                              color="secondary"
                              startIcon={<MusicNoteIcon />}
                              onClick={() => history.push('/listeningroom')}
                            >
                              Create Listening Room
                            </Button>
                          </Grid>
                      }
                  </Toolbar>
                  {mixtape.songs.map((song, index) => (
                    <Draggable
                      key={`item${index}`}
                      draggableId={`item${index}`}
                      index={index}
                      isDragDisabled={!isEditing}
                    >
                      {(provided, snapshot) => (
                        // TODO: This list item should be a seperate component
                        <Grid container onClick={() => isEditing ? clickCheckbox(mixtape.songs[index].id) : undefined}>
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {isEditing ? 
                              <Grid item xs={1}>
                                <Checkbox
                                  checked={songsToDelete.includes(mixtape.songs[index].id)}
                                />
                              </Grid>
                              : <div />}
                            <Grid item xs={isEditing ? 9 : 10}>
                              <div style={{left: '0', marginRight: '10%' }}>
                                <img style={{width: '70px', height: '70px'}} src={`https://img.youtube.com/vi/${song.id}/1.jpg`} alt='mixtape_cover'></img>
                                {/* TODO: fetch actual song names from API */}
                                <ListItemText>{song.name || `song_${mixtape.songs[index]}`}</ListItemText>
                              </div>
                            </Grid>
                            <Grid item xs={2}>
                              <PlayIcon fontSize="large" onClick={() => playSong(index)} style={{display: isEditing ? 'none' : '' }} />
                            </Grid>
                          </ListItem>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>
      </Box>
    );
}
  
  export default Mixtape;
  