import React, { useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Toolbar,
} from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { MusicNote as MusicNoteIcon, Settings as SettingsIcon, Edit as EditIcon, PlayCircleFilledWhite as PlayIcon, Delete as DeleteIcon, AddCircle as AddIcon, Save as SaveIcon, Undo as UndoIcon, Cake as CakeIcon } from '@material-ui/icons';
import CurrentSongContext from '../contexts/CurrentSongContext';
import PlayingSongContext from '../contexts/PlayingSongContext';
import JSTPSContext from '../contexts/JSTPSContext';
import { getSongDuration, songSearch, updateMixtape } from '../utils/api';
import { Autocomplete } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import SettingsModal from './modals/SettingsModal';
import SongSearchBar from './SongSearchBar';
import { SongPosition_Transaction } from './transactions/SongPosition_Transaction';
import tps from '../App';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: '1em',
  marginBottom: '1em',
  background: isDragging ? 'steelblue' : 'grey',
  ...draggableStyle,
});

const useStyles = makeStyles(() => ({
  fab: {
    position: 'fixed',
    bottom: '15%',
    right: '5%',
  },
}));


function Mixtape(props) {
  const history = useHistory();

  const classes = useStyles();
  const [songsToDelete, setSongsToDelete] = useState([]);

  const { enableEditing, isEditing, setIsEditing, mixtape, setMixtape, permissions, setPermissions, permissionUserList, setPermissionUserList } = props;

  const { currentSong, setCurrentSong } = useContext(CurrentSongContext);

  const { setPlaying } = useContext(PlayingSongContext);

  const { tps, setTps } = useContext(JSTPSContext);

  const [addSongPopupIsOpen, setAddSongPopupIsOpen] = useState(false); // whether add song popup is open
  const [addSongSearchResults, setAddSongSearchResults] = useState([]); // search results in song search
  const [addSongAutocompleteOpen, setAddSongAutocompleteOpen] = useState(false); // whether autocomplete inside song popup is open
  const [songToAdd, setSongToAdd] = useState({});
  const [settingsPopupIsOpen, setSettingsPopupIsOpen] = useState(false);

  const [apiToUse, setApiToUse] = useState('soundcloud');

  const handleAddSongPopup = () => {
    setAddSongPopupIsOpen(!addSongPopupIsOpen);
  };

  const handleSettingsPopup = () => {
    setSettingsPopupIsOpen(!settingsPopupIsOpen);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    // set new list order
    const newSongOrder = [...mixtape.songs];
    const [removed] = newSongOrder.splice(result.source.index, 1);
    const moveSongTransaction = new SongPosition_Transaction(result.source.index, result.destination.index, removed, newSongOrder, mixtape);
    tps.addTransaction(moveSongTransaction);
    newSongOrder.splice(result.destination.index, 0, removed);
    mixtape.songs = newSongOrder;
    setMixtape(mixtape);
  };

  const playSong = (index) => {
    setPlaying(true);
    setCurrentSong({
      mixtape,
      index,
      disabled: currentSong?.disabled,
    });
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
    const newSongs = mixtape.songs.filter(song => !songsToDelete.includes(song.id));
    mixtape.songs = newSongs;
    setMixtape(mixtape);
    setSongsToDelete([]);
  }

  const saveMixtape = async () => {
    setIsEditing(false);
    updateMixtape(mixtape);
    setCurrentSong({
      mixtape: currentSong.mixtape,
      index: currentSong.index,
      disabled: null,
    });
  }

  const addSong = async () => {
    const newSongs = [...mixtape.songs];
    const duration = await getSongDuration(apiToUse, songToAdd.id);
    songToAdd.duration = duration;
    newSongs.push(songToAdd);
    mixtape.songs = newSongs;
    setMixtape(mixtape);
    setSongToAdd({});
  }

  const enableEditingHandler = () => {
    setIsEditing(true);
    setCurrentSong({
      mixtape: currentSong?.mixtape,
      index: currentSong?.index,
      disabled: mixtape._id,
    });
    setPlaying(false);
  }

  const undoAction = () => {
    console.log("Undo the action");
    console.log("Mixtape before undo:\n\t" + toString());
    tps.undoTransaction();
    setMixtape(mixtape);
    console.log("Mixtape after undo:\n\t" + toString());
    console.log(tps.toString());
    updateMixtape(mixtape);
    setCurrentSong({
      mixtape: currentSong.mixtape,
      index: currentSong.index,
      disabled: null,
    });
  }

  var fruits = ['apple', 'banana', 'orange', 'mango', 'grapes', 'coconut'];

  const simulateTransaction = () => {
    console.log("Simulate transaction");
    // const someFruit = 'kiwi';
    // const moveSongTransaction = new SongPosition_Transaction(1, 3, someFruit, fruits, fruitsList);
    // tps.addTransaction(moveSongTransaction);
    // console.log(tps.toString());
  }

  function toString() {
    for (var i = 0; i < mixtape.songs.length; i++) {
      console.log("Song: " + i + ", " + mixtape.songs[i].id);
    }
  }

  return (
    <Box style={{
      display: 'inline-flex',
      overflow: 'auto',
      maxHeight: '50vh',
      flexDirection: 'row',
      backgroundColor: blueGrey[900],
      marginBottom: '30px',
      paddingTop: '20px',
      paddingBottom: '20px',
      width: '90%',
      height: '100%'
    }} boxShadow={3} borderRadius={12}>

      <Dialog open={addSongPopupIsOpen} onClose={handleAddSongPopup}>
        <DialogTitle id="form-dialog-title">Add a Song!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Type the song you want to add:
            </DialogContentText>
          <Grid container>
            <Grid item xs={8}>
              <SongSearchBar apiToUse={apiToUse} setSelected={setSongToAdd} /> 
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2}>
              <Select value={apiToUse} onChange={(e) => setApiToUse(e.target.value)}>
                <MenuItem value={'soundcloud'}>SoundCloud</MenuItem>
                <MenuItem value={'youtube'}>YouTube</MenuItem>
              </Select>
            </Grid>
          </Grid>
          
        </DialogContent>
        <DialogActions>
          <Button align="center" onClick={() => addSong()} color="primary">
            Add
            </Button>
        </DialogActions>
      </Dialog>


      <SettingsModal
        mixtape={mixtape}
        setMixtape={setMixtape}
        settingsPopupIsOpen={settingsPopupIsOpen}
        handleSettingsPopup={handleSettingsPopup}
        permissions={permissions}
        setPermissions={setPermissions}
        permissionUserList={permissionUserList}
        setPermissionUserList={setPermissionUserList}
      />


      <Grid container justify="center">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ width: '90%' }}
              >
                <Toolbar style={{ backgroundColor: 'black', display: enableEditing ? '' : 'none' }}>
                  {isEditing ?
                    <Grid container>
                      <Grid item xs={1}>
                        <Button startIcon={<SaveIcon />} style={{ marginRight: '5%', float: 'right' }} onClick={() => saveMixtape(mixtape)} variant="contained">DONE</Button>
                      </Grid>
                      <Grid item xs={5} />
                      <Grid item xs={2}>
                        <Button
                          style={{ marginRight: '5%', float: 'right', backgroundColor: 'green' }}
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
                          style={{ marginRight: '5%', float: 'right' }}
                          variant="contained"
                          color="primary"
                          startIcon={<AddIcon />}
                        >
                          Add a Song
                              </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          style={{ display: songsToDelete.length > 0 ? '' : 'none', marginRight: '5%', float: 'right' }}
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
                      <Button startIcon={<EditIcon />} onClick={enableEditingHandler} style={{ position: 'absolute', right: '5%' }} variant="contained">EDIT</Button>
                      <Button
                        style={{ marginRight: '5%', float: 'right', backgroundColor: 'steelblue' }}
                        variant="contained"
                        color="secondary"
                        startIcon={<MusicNoteIcon />}
                      // onClick={() => history.push('/listeningroom')}
                      >
                        Create Listening Room
                            </Button>
                    </Grid>
                  }
                </Toolbar>
                {mixtape?.songs.map((song, index) => (
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
                            <div style={{ left: '0', marginRight: '10%' }}>
                              <img style={{ width: '70px', height: '70px' }} src={song.coverImage} alt='mixtape_cover'></img>
                              {/* TODO: fetch actual song names from API */}
                              <ListItemText>{song.name || `song_${mixtape.songs[index]}`}</ListItemText>
                            </div>
                          </Grid>
                          <Grid item xs={2}>
                            <PlayIcon fontSize="large" onClick={() => playSong(index)} style={{ display: isEditing ? 'none' : '' }} />
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
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => undoAction()}>
                <UndoIcon />
      </Fab>
      <Fab color="secondary" style={{    position: 'fixed', bottom: '15%', right: '10%',}} onClick={() => simulateTransaction()}> 
          <CakeIcon />
      </Fab>
    </Box>
  );
}

export default Mixtape;
