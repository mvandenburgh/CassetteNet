import React, { useContext, useEffect, useState } from 'react';
import { IconButton, Box, Grid, Typography } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { getPopularMixtapes, getFollowedUsersActivity, getUserProfilePictureUrl, getMixtapeCoverImageUrl } from '../../utils/api';
import { useHistory } from 'react-router-dom';
import PlayerAnimationContext from '../../contexts/PlayerAnimationContext';
import { motion } from 'framer-motion';

const MixtapeRows = ({ mixtapes, history }) => (
  <>

    {mixtapes?.map(mixtape => (
      <Box
        style={{
          margin: "5px",
          padding: "10px",
          backgroundColor: blueGrey[700],
          display: "flex",
          flexDirection: "row",
          borderRadius: 6,
          fontSize: 18,
        }}
      >
        <Grid container>
          <Grid style={{ cursor: 'pointer' }} item xs={4} onClick={() => history.push(`/mixtape/${mixtape._id}`)}>
            <figure>
              <img style={{ height: '3em' }} src={getMixtapeCoverImageUrl(mixtape._id)} alt="cover_image" />
              <figcaption>{mixtape.name}</figcaption>
            </figure>
          </Grid>
          {/* <Grid item xs={2} style={{ display: 'flex', justifyContent: "center", cursor: 'pointer' }} onClick={() => history.push(`/mixtape/${mixtape._id}`)}> {mixtape.name} </Grid> */}
          <Grid item xs={4} style={{ display: 'flex', justifyContent: "center", cursor: 'pointer' }} onClick={() => history.push(`/user/${mixtape.collaborators?.filter(c => c.permissions === 'owner')[0]?.user}`)}>
            <figure>
              {/* <ReactRoundedImage image={getUserProfilePictureUrl(mixtape.collaborators?.filter(c => c.permissions === 'owner')[0]?.user)} roundedSize="1" style={{ height: '1em' }} /> */}
              <img style={{ height: '2em' }} src={getUserProfilePictureUrl(mixtape.collaborators?.filter(c => c.permissions === 'owner')[0]?.user)} alt="pfp" />
              <figcaption>{mixtape.collaborators?.filter(c => c.permissions === 'owner')[0]?.username}</figcaption>
            </figure>
          </Grid>
          <Grid item xs={4} style={{ display: 'flex', flexDirection: "row", justifyContent: "center" }}>
            {mixtape.favorites}
            {/* <FavoriteMixtapeButton id={mixtape._id} /> */}
            {/* <CommentIcon /> */}
            {/* <ShareIcon /> */}
          </Grid>
        </Grid>
      </Box>
    ))}
  </>
);

function DashboardPage() {
  const [userActivities, setUserActivities] = useState([]);
  const { animating } = useContext(PlayerAnimationContext);

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
  const colors = {
    namePfpContainer: blueGrey[900],
    tabsContainer: blueGrey[900],
    mixtapeRowColor: blueGrey[800]
  }

  const history = useHistory();
  const [mixtapes, setMixtapes] = useState([]);

  useEffect(() => {
    getPopularMixtapes(5).then(mixtapes => setMixtapes(mixtapes));
    getFollowedUsersActivity().then(activities => {
      if (activities?.length > 0) {
        setUserActivities(activities.map(activity => (
          <>
            <Box style={{
              margin: "5px",
              padding: "10px",
              backgroundColor: blueGrey[700],
              display: "flex",
              flexDirection: "row",
              borderRadius: 6,
              fontSize: '1.5em',
            }}>
              <Box style={{ display: 'flex', justifyContent: "center" }}>
                <div>
                  <img style={{ height: '1em', width: '1em', cursor: 'pointer' }} src={getUserProfilePictureUrl(activity.user)} onClick={() => history.push(`/user/${activity.user}`)} alt="pfp" />
                  <span style={{ color: 'white', cursor: 'pointer' }} onClick={() => history.push(activity.targetUrl)}>{activity.username} {activity.action}</span>
                </div>
              </Box>
            </Box>

          </>
        )));
      } else {
        setUserActivities(['No recent activity.']);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => history.goBack();

  return (
    <div style={{ color: 'white', left: 0, marginBottom: '10%' }}>
      <IconButton color="secondary" aria-label="back" onClick={goBack}>
        <ArrowBackIcon />
      </IconButton>
      <br />
      <Box style={{
        backgroundColor: blueGrey[900],
        //marginRight: '50px',
        margin: 'auto',
        padding: '10px',
        textAlign: "center",
        borderRadius: 6,
        boxShadow: 6,
        width: '80%'
      }}>
       {animating? 
        <motion.div variants={togglesVariants}
        initial="hidden"
        animate="visible">
          <Typography variant="h3"> Most Popular Mixtapes </Typography>
        </motion.div>
        :
        <Typography variant="h3"> Most Popular Mixtapes </Typography>
       }
        <br />
        <Box style={{ backgroundColor: blueGrey[900], display: "flex", flexDirection: "row" }} >
          <Grid container>
            <Grid item xs={4}>
              <Box style={{
                backgroundColor: blueGrey[800],
                textAlign: "center",
                boxShadow: "3",
                borderRadius: 6
              }}>Name</Box>
            </Grid>
            <Grid item xs={4}>
              <Box style={{
                backgroundColor: blueGrey[800],
                textAlign: "center",
                boxShadow: 3,
                borderRadius: 6
              }}>Owner</Box>
            </Grid>
            <Grid item xs={4}>
              <Box style={{
                backgroundColor: blueGrey[800],
                textAlign: "center",
                boxShadow: "3",
                borderRadius: 6
              }}>Favorites</Box>
            </Grid>
          </Grid>
        </Box>
        <Box style={{
          borderRadius: 6,
          backgroundColor: blueGrey[900],
        }}>
          <MixtapeRows mixtapes={mixtapes} history={history} />
        </Box>
      </Box>

      <br />
      <Box style={{
        backgroundColor: blueGrey[900],
        margin: 'auto',
        padding: '10px',
        textAlign: "center",
        borderRadius: 6,
        boxShadow: 6,
        width: '80%'
      }}>
        {animating? 
        <motion.div variants={togglesVariants}
        initial="hidden"
        animate="visible">
          <Typography variant="h3">Followed User Activity</Typography>
        </motion.div>
        :
        <Typography variant="h3">Followed User Activity</Typography>
       }
        
        <br />
        <Box style={{
          marginTop: "5px",
          backgroundColor: colors.tabsContainer,
        }}>
          {userActivities}
        </Box>
      </Box>
    </div>
  );
}

export default DashboardPage;
