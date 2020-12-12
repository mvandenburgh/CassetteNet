import React, { useEffect, useState } from 'react';
import { IconButton, Box, Grid, Typography } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import ReactRoundedImage from 'react-rounded-image';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { getPopularMixtapes, getFollowedUsersActivity, getUserProfilePictureUrl, getRandomMixtapes, getMixtapeCoverImageUrl } from '../../utils/api';
import { useHistory } from 'react-router-dom';
import parse from 'html-react-parser';

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
              <img style={{ height: '3em' }} src={getMixtapeCoverImageUrl(mixtape._id)} />
              <figcaption>{mixtape.name}</figcaption>
            </figure>
          </Grid>
          {/* <Grid item xs={2} style={{ display: 'flex', justifyContent: "center", cursor: 'pointer' }} onClick={() => history.push(`/mixtape/${mixtape._id}`)}> {mixtape.name} </Grid> */}
          <Grid item xs={4} style={{ display: 'flex', justifyContent: "center", cursor: 'pointer' }} onClick={() => history.push(`/user/${mixtape.collaborators?.filter(c => c.permissions === 'owner')[0]?.user}`)}>
            <figure>
              {/* <ReactRoundedImage image={getUserProfilePictureUrl(mixtape.collaborators?.filter(c => c.permissions === 'owner')[0]?.user)} roundedSize="1" style={{ height: '1em' }} /> */}
              <img style={{ height: '2em' }} src={getUserProfilePictureUrl(mixtape.collaborators?.filter(c => c.permissions === 'owner')[0]?.user)} />
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

function DashboardPage(props) {
  const [userActivities, setUserActivities] = useState([]);

  const colors = {
    namePfpContainer: blueGrey[900],
    tabsContainer: blueGrey[900],
    mixtapeRowColor: blueGrey[800]
  }

  const ActivityRows = ({ activities }) => (
    <>
      {activities.map(activity => (
        <Box style={{
          margin: "5px",
          padding: "10px",
          backgroundColor: blueGrey[700],
          display: "flex",
          flexDirection: "row",
          borderRadius: 6,
          fontSize: '1.5em',
        }}>
          <Box style={{ display: 'flex', justifyContent: "center" }}> {activity} </Box>
        </Box>
      ))}
    </>
  );

  const history = useHistory();
  const [mixtapes, setMixtapes] = useState([]);

  useEffect(() => {
    getPopularMixtapes(5).then(mixtapes => setMixtapes(mixtapes));
    getFollowedUsersActivity().then(activities => {
      if (activities?.length > 0) {
        setUserActivities(activities.map(activity => parse(`
          <span>
            <a href="/user/${activity.user}">
              <img style="height: 1em; width: 1em;" src="${getUserProfilePictureUrl(activity.user)}">
            </a>
            <a style="color: white;" href=${activity.targetUrl}>${activity.username} ${activity.action}</a>
          </span>
        `)));
      } else {
        setUserActivities(['No recent activity.']);
      }
    });
  }, []);

  const goBack = () => history.goBack();

  return (
    <div style={{ color: 'white', left: 0 }}>
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
        <Typography variant="h3"> Popular Mixtapes This Week</Typography>
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
        <Typography variant="h3">Followed User Activity</Typography>
        <br />
        <Box style={{
          marginTop: "5px",
          backgroundColor: colors.tabsContainer,
        }}>
          <ActivityRows activities={userActivities} />
        </Box>
      </Box>
    </div>
  );
}

export default DashboardPage;
