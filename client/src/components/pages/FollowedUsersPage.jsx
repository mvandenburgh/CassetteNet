import React, { useEffect, useContext, useState } from 'react';
import { Box, Grid, Typography, IconButton } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { getFollowedUsers } from '../../utils/api';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import CurrentSongContext from '../../contexts/CurrentSongContext';
import UserList from '../UserList';
import PlayerAnimationContext from '../../contexts/PlayerAnimationContext';
import { motion } from 'framer-motion';

function FollowedUsersPage() {

  const { currentSong } = useContext(CurrentSongContext);

  const [followedUsers, setFollowedUsers] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { animating, setAnimating } = useContext(PlayerAnimationContext);

    const togglesVariants = {
        hidden: {
        scale: 1
        },
        visible: {
        scale: 1.1,
        transition: {
            yoyo: Infinity
        }
        }
    }

  const changePageHandler = (event, pageNumber) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    getFollowedUsers(currentPage).then(users => {
      setFollowedUsers(users.users);
      setCurrentPage(users.currentPage);
      setTotalPages(users.totalPages);
      setTotalResults(users.totalResults);
    });
  }, [currentPage]);

  const history = useHistory();
  const goBack = () => history.goBack();

  return (
    <div style={{ color: 'white', left: 0, marginBottom: `${currentSong.playBarHeight}px` }}>
      <IconButton color="secondary" aria-label="back" onClick={goBack}>
        <ArrowBackIcon />
      </IconButton>
      <br />
      {animating?
                    <motion.div variants={togglesVariants}
                    initial="hidden"
                    animate="visible">
                        <Typography variant="h2" style={{ textAlign: "center" }}> Followed Users </Typography>
                    </motion.div>
                    :
                    <div>
                        <Typography variant="h2" style={{ textAlign: "center" }}> Followed Users </Typography>
                    </div>
                }
      
      <br />
      <Box style={{ width: "25%", display: 'flex', paddingLeft: '120px' }}>
        <br />
      </Box>
      <div style={{ width: "70%", margin: 'auto' }}>
        <UserList users={followedUsers} />
      </div>
      <Grid container alignItems="center" style={{backgroundColor: 'lightblue', width: '70%', margin: 'auto'}}>
        <Pagination align="center" justify="center" style={{ margin: 'auto' }} count={totalPages} page={currentPage} onChange={changePageHandler} />
      </Grid>
    </div>
  );
}

export default FollowedUsersPage;
