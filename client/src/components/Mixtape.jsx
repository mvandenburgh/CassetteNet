import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AppBar, Box, Button, Grid, Toolbar, Checkbox, List, ListItem, ListItemText } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { Edit as EditIcon, PlayCircleFilledWhite as PlayIcon, Delete as DeleteIcon, AddCircle as AddIcon, Save as SaveIcon } from '@material-ui/icons';
import CurrentSongContext from '../contexts/CurrentSongContext';
import PlayingSongContext from '../contexts/PlayingSongContext';
import { getMixtape } from '../utils/api';


const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: '1em',
    marginBottom: '1em',
    background: isDragging ? 'steelblue' : 'grey',
    ...draggableStyle,
  });

function Mixtape(props) {
    const [mixtape, setMixtape] = useState(getMixtape(props.id));

    const [songsToDelete, setSongsToDelete] = useState([]);

    const { enableEditing, isEditing, setIsEditing } = props;

    const { setCurrentSong } = useContext(CurrentSongContext);

    const { playing, setPlaying } = useContext(PlayingSongContext);

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
                            <Grid item xs={7} />
                            <Grid item xs={2}>
                              <Button
                                style={{marginRight: '5%', float: 'right'}}
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                onClick={() => deleteSongs()}
                              >
                                Delete
                              </Button>
                            </Grid>
                            <Grid item xs={2}>
                              <Button
                                style={{marginRight: '5%', float: 'right'}}
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                              >
                                Add a Song
                              </Button>
                            </Grid>
                          </Grid>
                        :
                          <Button startIcon={<EditIcon />} onClick={() => setIsEditing(true)} style={{position: 'absolute', right: '5%'}} variant="contained">EDIT</Button>
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
                        <Grid container>
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
                                  onClick={() => clickCheckbox(mixtape.songs[index].id)}
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
  