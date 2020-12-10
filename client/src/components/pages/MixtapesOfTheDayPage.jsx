import React, { useEffect, useState } from 'react';
import CommentIcon from '@material-ui/icons/Comment';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteMixtapeButton from '../FavoriteMixtapeButton';
import blueGrey from '@material-ui/core/colors/blueGrey';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import { Box, Button, Grid, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import { getRandomMixtapes } from '../../utils/api';

const MixtapeRows = ({ mixtapes, history }) => (
  <>

    {mixtapes.map(mixtape => (
      <Box
        style={{
          margin: "5px",
          padding: "10px",
          backgroundColor: blueGrey[700],
          display: "flex",
          flexDirection: "row",
          borderRadius: 6,
          fontSize: 12,
        }}
      >
        <Box style={{ width: "33%", display: 'flex', justifyContent: "center", cursor: 'pointer' }} onClick={() => history.push(`/mixtape/${mixtape._id}`)}> {mixtape.name} </Box>
        <Box style={{ width: "33%", display: 'flex', justifyContent: "center", cursor: 'pointer' }} onClick={() => history.push(`/user/${mixtape.collaborators.filter(c => c.permissions === 'owner')[0].user}`)}> {mixtape.collaborators.filter(c => c.permissions === 'owner')[0].username} </Box>
        <Box style={{ width: "33%", display: 'flex', flexDirection: "row", justifyContent: "center" }}>
          <FavoriteMixtapeButton id={mixtape._id} />
          {/* <CommentIcon /> */}
          {/* <ShareIcon /> */}
        </Box>
      </Box>
    ))}
  </>
);

function MixtapesOfTheDayPage(props) {

  const [open, setOpen] = useState(false);

  const [mixtapes, setMixtapes] = useState([]);

  const handleClickOpen = () => {
    return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getRandomMixtapes(10, 'daily').then(mixtapes => setMixtapes(mixtapes));
  }, []);

  const history = useHistory();
  const goBack = () => { history.push('/') }

  const todaysDate = new Date();

  return (
    <div style={{ color: 'white', left: 0 }}>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Write a Message!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Give some feedback on the mixtape!
          </DialogContentText>
          <TextField
            multiline
            rows={17}
            style={{ height: '300px', width: '400px' }}
            autoFocus
            variant="filled"
            margin="dense"
            id="name"
            label="Message"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button align="center" onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
        <ArrowBackIcon />
      </IconButton>
      <br />
      <Typography variant="h3" style={{ textAlign: "center" }}>Mixtapes of the Day ({todaysDate.getMonth()+1}/{todaysDate.getDate()}/{todaysDate.getFullYear().toString().substring(2)})</Typography>
      <br />
      <Grid container direction="row">

        <Box style={{ backgroundColor: blueGrey[900], marginLeft: "170px", width: "80%", display: "flex", flexDirection: "row", borderRadius: 3, padding: '5px' }} >
          <Box style={{
            backgroundColor: blueGrey[900],
            width: "33%",
            textAlign: "center",
            boxShadow: "3",
            borderRadius: 6
          }}>
            Name
            </Box>
          <Box style={{
            backgroundColor: blueGrey[900],
            width: "33%",
            textAlign: "center",
            boxShadow: 3,
            borderRadius: 6
          }}>
            Creator
            </Box>
          <Box style={{
            backgroundColor: blueGrey[900],
            width: "34%",
            textAlign: "center",
            boxShadow: "3",
            borderRadius: 6
          }}>
            Favorite
            </Box>
        </Box>
        <Box onClick={handleClickOpen} style={{
          marginLeft: "170px",
          marginTop: '5px',
          marginRight: '10px',
          padding: '5px',
          borderRadius: 6,
          backgroundColor: blueGrey[900],
          width: '80%'
        }}>
          <MixtapeRows mixtapes={mixtapes} history={history} />
        </Box>
      </Grid>


    </div>
  );
}

export default MixtapesOfTheDayPage;
