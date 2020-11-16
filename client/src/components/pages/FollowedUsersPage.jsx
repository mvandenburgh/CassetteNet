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
import { blueGrey, indigo, lightBlue } from '@material-ui/core/colors'
import { Autocomplete } from '@material-ui/lab';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import ReactRoundedImage from "react-rounded-image";
import { useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import { getUserProfilePictureUrl } from '../../utils/api';
import FollowUserButton from '../FollowUserButton';

function FollowedUsersPage(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [highlightedRow, setHighlightedRow] = useState(null);

  const colors = {
    followedUserRowColor: blueGrey[900],
    followedUserRowMouseOverColor: blueGrey[500],
    unfollowButtonColor: lightBlue[500],
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

  const FollowedUserRows = ({ followedUsers, history }) => (
    <>
      {followedUsers.map((user, index) => (
        <div onMouseEnter={() => setHighlightedRow(index)} onMouseLeave={() => setHighlightedRow(null)}>
          <Box
            style={{
              margin: "5px",
              padding: "10px",
              backgroundColor: index === highlightedRow ? colors.followedUserRowMouseOverColor : colors.followedUserRowColor,
              cursor: 'pointer',
              display: "flex",
              flexDirection: "row",
              borderRadius: 6,
              fontSize: 12,
            }}
            boxShadow={3}
            onClick={() => history.push(`/user/${user._id}`)}
            >
            <Box style={{ width: "33%", display: 'flex', flexDirection: 'row', marginLeft: '15px' }}>
              <ReactRoundedImage image={getUserProfilePictureUrl(user._id)} roundedSize="1" imageWidth="100" imageHeight="100" />
              <br />
              <Box style={{ fontSize: '15pt', width: "50%", display: 'flex', justifyContent: "left", marginLeft: '15px' }}> {user.username}#{user.uniqueId} </Box>
            </Box>

            <Box style={{ fontSize: '12pt', marginLeft: '50px', width: "33%", display: 'flex', flexDirection: 'column' }}>
              Last activity: {user.updatedAt}
              <br />
              <br />
                  User since: {user.createdAt}
              <br />
              <br />
                  Followers: {user.followers}
            </Box>
            <Box style={{ width: "25%", display: 'flex', justifyContent: "left" }}>
              <br />
                <FollowUserButton id={user._id} backgroundColor={colors.unfollowButtonColor} />
            </Box>
          </Box>
        </div>
      ))}
    </>
  );

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
        <FollowedUserRows followedUsers={user.followedUsers} history={history} />
      </div>
    </div>
  );
}

export default FollowedUsersPage;
