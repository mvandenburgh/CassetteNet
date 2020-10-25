import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Grid, List, ListItem, ListItemText } from '@material-ui/core';

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
    name: 'mixtape1',
    collaborators: ['user1, user2'],
    favorites: '50k',
    cover: 'https://lh3.googleusercontent.com/proxy/7eEAgbTWh23DfrW43yeKQ3z8v9nCip-7giCYcAKGMAGDtoCJKvLWdkS-TnvToo6gztayXKU3EdyDiT_9vHepm98jkhSxD06Zhy2Y97WXl_6WxA_YO7fyRxTDRKcBuf46jYV5O6UjCCDQ',
  },
  {
    name: 'mixtape2',
    collaborators: ['user1, user2'],
    favorites: '10k',
    cover: 'https://lh3.googleusercontent.com/proxy/7eEAgbTWh23DfrW43yeKQ3z8v9nCip-7giCYcAKGMAGDtoCJKvLWdkS-TnvToo6gztayXKU3EdyDiT_9vHepm98jkhSxD06Zhy2Y97WXl_6WxA_YO7fyRxTDRKcBuf46jYV5O6UjCCDQ',
  },
  {
    name: 'mixtape3',
    collaborators: ['user1, user2'],
    favorites: '10k',
    cover: 'https://lh3.googleusercontent.com/proxy/7eEAgbTWh23DfrW43yeKQ3z8v9nCip-7giCYcAKGMAGDtoCJKvLWdkS-TnvToo6gztayXKU3EdyDiT_9vHepm98jkhSxD06Zhy2Y97WXl_6WxA_YO7fyRxTDRKcBuf46jYV5O6UjCCDQ',
  },
  {
    name: 'mixtape4',
    collaborators: ['user1, user2'],
    favorites: '10k',
    cover: 'https://lh3.googleusercontent.com/proxy/7eEAgbTWh23DfrW43yeKQ3z8v9nCip-7giCYcAKGMAGDtoCJKvLWdkS-TnvToo6gztayXKU3EdyDiT_9vHepm98jkhSxD06Zhy2Y97WXl_6WxA_YO7fyRxTDRKcBuf46jYV5O6UjCCDQ',
  },
  {
    name: 'mixtape5',
    collaborators: ['user1, user2'],
    favorites: '10k',
    cover: 'https://lh3.googleusercontent.com/proxy/7eEAgbTWh23DfrW43yeKQ3z8v9nCip-7giCYcAKGMAGDtoCJKvLWdkS-TnvToo6gztayXKU3EdyDiT_9vHepm98jkhSxD06Zhy2Y97WXl_6WxA_YO7fyRxTDRKcBuf46jYV5O6UjCCDQ',
  },
];

function MixtapeList(props) {
  const [items, setItems] = useState(sampleMixtapes);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    // set new list order
    const newArray = [...items];
    const [removed] = newArray.splice(result.source.index, 1);
    newArray.splice(result.destination.index, 0, removed);

    setItems(newArray);
  };

  return (
    <Grid container justify='center'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{padding: '10%', width: '70%'}}
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
              {items.map((mixtape, index) => (
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
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Grid>
  );
}

export default MixtapeList;
