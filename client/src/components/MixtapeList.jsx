import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Fab, List, ListItem, ListItemText } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: '1em',
  marginBottom: '1em',
  background: isDragging ? 'steelblue' : 'grey',
  ...draggableStyle,
});

// TODO: move to JSON file
const sampleMixtapes = [
  {
    id: 0,
    name: 'mixtape1',
    collaborators: ['user1, user2'],
    favorites: '50k',
    cover: 'https://lh3.googleusercontent.com/proxy/7eEAgbTWh23DfrW43yeKQ3z8v9nCip-7giCYcAKGMAGDtoCJKvLWdkS-TnvToo6gztayXKU3EdyDiT_9vHepm98jkhSxD06Zhy2Y97WXl_6WxA_YO7fyRxTDRKcBuf46jYV5O6UjCCDQ',
  },
  {
    id: 1,
    name: 'mixtape2',
    collaborators: ['user1, user2'],
    favorites: '10k',
    cover: 'https://lh3.googleusercontent.com/proxy/7eEAgbTWh23DfrW43yeKQ3z8v9nCip-7giCYcAKGMAGDtoCJKvLWdkS-TnvToo6gztayXKU3EdyDiT_9vHepm98jkhSxD06Zhy2Y97WXl_6WxA_YO7fyRxTDRKcBuf46jYV5O6UjCCDQ',
  },
  {
    id: 2,
    name: 'mixtape3',
    collaborators: ['user1, user2'],
    favorites: '10k',
    cover: 'https://lh3.googleusercontent.com/proxy/7eEAgbTWh23DfrW43yeKQ3z8v9nCip-7giCYcAKGMAGDtoCJKvLWdkS-TnvToo6gztayXKU3EdyDiT_9vHepm98jkhSxD06Zhy2Y97WXl_6WxA_YO7fyRxTDRKcBuf46jYV5O6UjCCDQ',
  },
  {
    id: 3,
    name: 'mixtape4',
    collaborators: ['user1, user2'],
    favorites: '10k',
    cover: 'https://lh3.googleusercontent.com/proxy/7eEAgbTWh23DfrW43yeKQ3z8v9nCip-7giCYcAKGMAGDtoCJKvLWdkS-TnvToo6gztayXKU3EdyDiT_9vHepm98jkhSxD06Zhy2Y97WXl_6WxA_YO7fyRxTDRKcBuf46jYV5O6UjCCDQ',
  },
  {
    id: 4,
    name: 'mixtape5',
    collaborators: ['user1, user2'],
    favorites: '10k',
    cover: 'https://lh3.googleusercontent.com/proxy/7eEAgbTWh23DfrW43yeKQ3z8v9nCip-7giCYcAKGMAGDtoCJKvLWdkS-TnvToo6gztayXKU3EdyDiT_9vHepm98jkhSxD06Zhy2Y97WXl_6WxA_YO7fyRxTDRKcBuf46jYV5O6UjCCDQ',
  },
];

function MixtapeList(props) {
  const [mixtapes, setMixtapes] = useState(sampleMixtapes);

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
  const deleteMixtape = (id) => {
    setMixtapes(mixtapes.filter(mixtape => mixtape.id !== id));
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
                      <img style={{width: '30%', height: '30%'}} src={mixtape.cover} alt='mixtape_cover'></img>
                      <ListItemText>{mixtape.name}</ListItemText>
                    </div>
                    <ListItemText style={{ left:'20%', marginRight: '10%' }}>
                      {mixtape.collaborators}
                    </ListItemText>
                    <ListItemText style={{ marginRight: '10%' }}>
                      {mixtape.favorites}
                    </ListItemText>
                    <Fab onClick={() => deleteMixtape(mixtape.id)} color="primary" aria-label="delete">
                      <DeleteIcon />
                    </Fab>
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

export default MixtapeList;
