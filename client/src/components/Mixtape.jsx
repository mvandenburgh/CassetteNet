import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { PlayCircleFilledWhite as PlayIcon } from '@material-ui/icons';
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
              {mixtape.songs.map((song, index) => (
                <Draggable
                  key={`item${index}`}
                  draggableId={`item${index}`}
                  index={index}
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
                      <div style={{left: '0', marginRight: '10%' }}>
                        <img style={{width: '30%', height: '30%'}} src={song.cover} alt='mixtape_cover'></img>
                        {/* TODO: fetch actual song names from API */}
                        <ListItemText>{song.name || `song_${mixtape.songs[index]}`}</ListItemText>
                        
                      </div>
                      <PlayIcon onClick={() => playSong(index)} style={{position: 'absolute', right: '10%'}} />
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
  