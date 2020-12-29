import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Grid, List, ListItem, ListItemText } from '@material-ui/core';
import { getMixtapeCoverImageUrl } from '../utils/api';
import JSTPSContext from '../contexts/JSTPSContext';
import { MixtapePosition_Transaction } from './transactions/MixtapePosition_Transaction';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: '1em',
  marginBottom: '1em',
  background: isDragging ? 'steelblue' : 'grey',
  ...draggableStyle,
});

function MixtapeList(props) {
  const { mixtapes, setMixtapes } = props;
  console.log(mixtapes);
  const history = useHistory();

  const { tps } = useContext(JSTPSContext);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    // set new list order
    const newArray = [...mixtapes];
    const moveMixtapeTransaction = new MixtapePosition_Transaction(result.source.index, result.destination.index, newArray);
    tps.addTransaction(moveMixtapeTransaction);
    setMixtapes(newArray);
  };

  // // TODO: popup window confirmation
  // const deleteMixtape = (id, event) => {
  //   event.stopPropagation();
    
  //   setMixtapes(mixtapes.filter(mixtape => mixtape._id !== id));
  // };

  const openMixtape = (index) => {
    history.push(`/mixtape/${mixtapes[index]._id}`);
  };

  return (
    <Box style={{width: '100%' }} align="center">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{width: '70%'}}
            >
              <ListItem>
                <Grid container>
                  <Grid item xs={4}>
                    <ListItemText>Name</ListItemText>
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText>
                      Collaborators
                    </ListItemText>
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText>
                      Favorites
                    </ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
              {mixtapes?.map((mixtape, index) => (
                <div onClick={() => openMixtape(index)}>
                  <Grid container>
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
                          <Grid item xs={4}>
                            <div style={{left: '0', marginRight: '10%' }}>
                              <img style={{width: '30%', height: '30%'}} src={getMixtapeCoverImageUrl(mixtape._id)} alt='mixtape_cover'></img>
                              <ListItemText>{mixtape.name}</ListItemText>
                            </div>
                          </Grid>
                          <Grid item xs={4}>
                            <ListItemText style={{ left:'20%', marginRight: '10%' }}>
                              {mixtape.collaborators.map((collaborator, i) => i === (mixtape.collaborators.length - 1) ? collaborator.username : i < 5 ? `${collaborator.username}, ` : '')}
                              {mixtape.collaborators.length >= 5 ? '...' : ''}
                            </ListItemText>
                          </Grid>
                          <Grid item xs={4}>
                            <ListItemText style={{ marginRight: '10%' }}>
                              {mixtape.favorites}
                            </ListItemText>
                          </Grid>
                          {/* <Fab onClick={(e) => deleteMixtape(mixtape._id, e)} color="primary" aria-label="delete">
                            <DeleteIcon />
                          </Fab> */}
                        </ListItem>
                      )}
                    </Draggable>
                  </Grid>
                </div>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      {/* <Fab color="secondary" style={{position: 'fixed', bottom: '15%', right: '10%',}} onClick={() => redoHandler()}> 
          <RedoIcon />
      </Fab>
      <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: '15%', right: '15%',}} onClick={() => undoHandler()}>
                <UndoIcon />
      </Fab> */}
    </Box>
  );
}

export default MixtapeList;
