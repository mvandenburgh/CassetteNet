import React, { useEffect, useContext, useState } from 'react';
import { Box, Typography, IconButton } from '@material-ui/core';
import { getFollowedUsers } from '../../utils/api';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import CurrentSongContext from '../../contexts/CurrentSongContext';
import UserList from '../UserList';

function FollowedUsersPage() {

  const { currentSong } = useContext(CurrentSongContext);

  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    getFollowedUsers().then(users => setFollowedUsers(users));
  }, []);

  const history = useHistory();
  const goBack = () => history.goBack();

  return (
    <div style={{ color: 'white', left: 0, marginBottom: `${currentSong.playBarHeight}px` }}>
      <IconButton color="secondary" aria-label="back" onClick={goBack}>
        <ArrowBackIcon />
      </IconButton>
      <br />
      <Typography variant="h2" style={{ textAlign: "center" }}> Followed Users </Typography>
      <br />
      <Box style={{ width: "25%", display: 'flex', paddingLeft: '120px' }}>
        <br />
      </Box>
      <div style={{ width: "70%", margin: 'auto' }}>
        <UserList users={followedUsers} />
      </div>
    </div>
  );
}

export default FollowedUsersPage;
