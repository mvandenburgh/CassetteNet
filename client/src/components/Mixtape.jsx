import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { List, ListItem, ListItemText } from '@material-ui/core';

const sampleSongs = [
    {
        name: 'song1',
        artist: 'artist2',
    },
    {
        name: 'song3',
        artist: 'artist1',
    },
];

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: '1em',
    marginBottom: '1em',
    background: isDragging ? 'steelblue' : 'grey',
    ...draggableStyle,
  });

function Mixtape(props) {
    const [songs, setSongs] = useState(sampleSongs);

    // :id url param, will be useful later
    // const mixtapeId = props.id;

    const onDragEnd = (result) => {
      if (!result.destination) {
        return;
      }
  
      // set new list order
      const newArray = [...songs];
      const [removed] = newArray.splice(result.source.index, 1);
      newArray.splice(result.destination.index, 0, removed);
  
      setSongs(newArray);
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
              {songs.map((song, index) => (
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
                        <ListItemText>{song.name}</ListItemText>
                      </div>
                      
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
  