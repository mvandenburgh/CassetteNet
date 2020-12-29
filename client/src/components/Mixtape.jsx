import React, { useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { PlayCircleFilledWhite as PlayIcon } from '@material-ui/icons';
import YoutubeIcon from './icons/YoutubeIcon';
import SoundcloudIcon from './icons/SoundcloudIcon';
import CurrentSongContext from '../contexts/CurrentSongContext';
import PlayingSongContext from '../contexts/PlayingSongContext';
import JSTPSContext from '../contexts/JSTPSContext';
import { SongPosition_Transaction } from './transactions/SongPosition_Transaction';


const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: '1em',
  marginBottom: '1em',
  background: isDragging ? 'steelblue' : 'grey',
  ...draggableStyle,
});


function Mixtape(props) {
  const { isEditing, songsToDelete, setSongsToDelete, mixtape, setMixtape, listeningRoom, changeListeningRoomSong } = props;

  const { currentSong, setCurrentSong } = useContext(CurrentSongContext);

  const { setPlaying } = useContext(PlayingSongContext);

  const { tps } = useContext(JSTPSContext);

  const onDragEnd = (result) => {
    if (!result.destination || result.source.index === result.destination.index) {
      return;
    }

    // set new list order
    const newSongOrder = [...mixtape.songs];
    const moveSongTransaction = new SongPosition_Transaction(result.source.index, result.destination.index, newSongOrder, mixtape);
    tps.addTransaction(moveSongTransaction);
    setMixtape(mixtape);
  };

  const playSong = (index) => {
    setPlaying(true);
    if (!listeningRoom) {
      setCurrentSong({
        mixtape,
        index,
        disabled: currentSong?.disabled,
      });
    } else if (changeListeningRoomSong) {
      changeListeningRoomSong(index);
    }
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

  const getIcon = (song) => {
    switch (song.type) {
      case 'youtube':
        return <YoutubeIcon />
      case 'soundcloud':
        return <SoundcloudIcon />
      default:
        return <div />
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
      width: '100%',
      height: '100%'
    }} boxShadow={3} borderRadius={12}>

      <Grid container justify="center">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ width: '90%' }}
              >

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
                          <Grid item xs={1}>
                            <PlayIcon fontSize="large" onClick={() => playSong(index)} style={{ display: isEditing ? 'none' : '' }} />
                          </Grid>
                          <Grid justify="flex-end" item xs={1}>
                            {/* <YoutubeIcon /> */}
                            {getIcon(song)}
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
