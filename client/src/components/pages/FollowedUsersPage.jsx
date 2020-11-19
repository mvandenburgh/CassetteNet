import React, { useEffect, useContext, useState } from 'react';
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
import { lightBlue } from '@material-ui/core/colors';
import { Autocomplete } from '@material-ui/lab';

import { followUser, getFollowedUsers } from '../../utils/api';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import UserSearchBar from '../UserSearchBar';
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

const [followedUsers, setFollowedUsers] = useState([]);

    useEffect(async () => {
        const followedUsers = await getFollowedUsers();
        setFollowedUsers(followedUsers);
     }, []);
     
     useEffect(async () => {
      const followedUsers = await getFollowedUsers();
        setFollowedUsers(followedUsers);
     }, [followedUsers]);


  const { user } = useContext(UserContext);

  const history = useHistory();
  const goBack = () => history.goBack();

  const followUserHandler = async(user) => {
    if(user){
        await followUser(user._id);
        handleClose();
    }
}

  return (

    <div style={{ color: 'white', left: 0 }}>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Follow a User!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the username of the user you wish to follow
          </DialogContentText>
          <UserSearchBar userSelectHandler={followUserHandler} adminSearchBool={false} />
          
        </DialogContent>
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
        <UserList users={followedUsers} />
      </div>
    </div>
  );
}

export default FollowedUsersPage;
