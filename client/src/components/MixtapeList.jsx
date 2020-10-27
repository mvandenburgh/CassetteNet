import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Fab, List, ListItem, ListItemText } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { getUser } from '../utils/api';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: '1em',
  marginBottom: '1em',
  background: isDragging ? 'steelblue' : 'grey',
  ...draggableStyle,
});


function MixtapeList(props) {
  const [mixtapes, setMixtapes] = useState(props.mixtapes);

  const history = useHistory();

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    // set new list order
    const newArray = [...mixtapes];
    const [removed] = newArray.splice(result.source.index, 1);
    newArray.splice(result.destination.index, 0, removed);

    setMixtapes(newArray);
  };

  // TODO: popup window confirmation
  const deleteMixtape = (id, event) => {
    event.stopPropagation();
    
    setMixtapes(mixtapes.filter(mixtape => mixtape._id !== id));
  };

  const openMixtape = (index) => {
    history.push(`/mixtape/${mixtapes[index]._id}`);
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
            <ListItem>
              <div style={{ marginRight: '10%' }}>
                <ListItemText>Name</ListItemText>
              </div>
              <ListItemText style={{ left:'20%', marginRight: '10%' }}>
                Collaborators
              </ListItemText>
              <ListItemText style={{ marginRight: '10%' }}>
                Favorites
              </ListItemText>
            </ListItem>
            {mixtapes.map((mixtape, index) => (
              <div onClick={() => openMixtape(index)}>
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
                        <img style={{width: '30%', height: '30%'}} src={mixtape.coverImage} alt='mixtape_cover'></img>
                        <ListItemText>{mixtape.name}</ListItemText>
                      </div>
                      <ListItemText style={{ left:'20%', marginRight: '10%' }}>
                        {mixtape.collaborators.map(collaborator => getUser(collaborator.user))}
                      </ListItemText>
                      <ListItemText style={{ marginRight: '10%' }}>
                        {mixtape.favorites}
                      </ListItemText>
                      <Fab onClick={(e) => deleteMixtape(mixtape._id, e)} color="primary" aria-label="delete">
                        <DeleteIcon />
                      </Fab>
                    </ListItem>
                  )}
                </Draggable>
              </div>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default MixtapeList;
