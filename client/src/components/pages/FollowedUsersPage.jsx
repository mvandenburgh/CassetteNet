import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import UserList from '../UserList';

function FollowedUsersPage(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colors = {
    searchButtonColor: lightBlue[700],
}

  const suggestedUsers = [
    { name: 'DDrizzy123' },
    { name: 'TempAdmin' },
    { name: 'TempAdmin12' },
    { name: 'PartyPooper123' },
    { name: 'BobMarley' },
    { name: 'CoolName' },
  ];

  const { user } = useContext(UserContext);

  const history = useHistory();
  const goBack = () => history.goBack();

  return (

    <div style={{ color: 'white', left: 0 }}>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Follow a User!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the username of the user you wish to follow
          </DialogContentText>
          <Autocomplete
            size="small"
            style={{ width: 300 }}
            freeSolo
            disableClearable
            options={suggestedUsers.map((option) => option.name)}
            renderInput={(params) => (
              <TextField
                {...params}
                backgroundColor='white'
                label="Search..."
                margin="normal"
                variant="filled"
                InputProps={{ ...params.InputProps, type: 'search' }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button align="center" onClick={handleClose} color="primary">
            Follow
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
        <ArrowBackIcon />
      </IconButton>
      <br />
      <Typography variant="h2" style={{ textAlign: "center" }}> Followed Users </Typography>
      <br />
      <Box style={{ width: "25%", display: 'flex', paddingLeft: '120px' }}>
        <br />
        <Button onClick={handleClickOpen} variant="contained" boxShadow={3} style={{ margin: 'auto', backgroundColor: colors.searchButtonColor }}> Search for User</Button>
      </Box>
      <div style={{ width: "70%", margin: 'auto' }}>
        <UserList users={user.followedUsers} />
      </div>
    </div>
  );
}

export default FollowedUsersPage;
