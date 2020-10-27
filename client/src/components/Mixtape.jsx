import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AppBar, Button, Toolbar, Checkbox, List, ListItem, ListItemText } from '@material-ui/core';
import { PlayCircleFilledWhite as PlayIcon, Delete as DeleteIcon, AddCircle as AddCircleIcon } from '@material-ui/icons';
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

    const isEditing = props.isEditing;
    const setIsEditing = props.setIsEditing;

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
      setCurrentSong({ mixtape: props.id, song: mixtape.songs[index] })
    };

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{width: '70%'}}
            >
              <Toolbar style={{backgroundColor: 'purple', display: isEditing ? '' : 'none'}}>
                  <Button onClick={() => setIsEditing(false)} variant="contained">DONE</Button>
                  <AddCircleIcon style={{position: 'absolute', right: '10%'}} />
                  <DeleteIcon style={{position: 'absolute', right: '5%'}} />
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
                    <ListItem
                      
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <Checkbox style={{ display: isEditing ? '' : 'none' }} />
                      <div style={{left: '0', marginRight: '10%' }}>
                        <img style={{width: '30%', height: '30%'}} src={song.cover} alt='mixtape_cover'></img>
                        {/* TODO: fetch actual song names from API */}
                        <ListItemText>{song.name || `song_${mixtape.songs[index]}`}</ListItemText>
                        
                      </div>
                      <PlayIcon onClick={() => playSong(index)} style={{display: isEditing ? 'none' : '', position: 'absolute', right: '10%'}} />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    );
}
  
  export default Mixtape;
  