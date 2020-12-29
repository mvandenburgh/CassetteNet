import React, { useContext, useEffect, useState } from 'react';
import FavoriteMixtapeButton from '../FavoriteMixtapeButton';
import blueGrey from '@material-ui/core/colors/blueGrey';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CurrentSongContext from '../../contexts/CurrentSongContext';
import { useHistory } from 'react-router-dom';
import { Box, Grid, Typography, IconButton } from '@material-ui/core';
import { getRandomMixtapes } from '../../utils/api';
import PlayerAnimationContext from '../../contexts/PlayerAnimationContext';
import { motion } from 'framer-motion';

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
  const { currentSong } = useContext(CurrentSongContext);

  const [mixtapes, setMixtapes] = useState([]);
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

  useEffect(() => {
    getRandomMixtapes(10, 'daily').then(mixtapes => setMixtapes(mixtapes));
  }, []);

  const history = useHistory();
  const goBack = () => { history.push('/') }

  const todaysDate = new Date();

  return (
    <div style={{ color: 'white', left: 0, marginBottom: `${currentSong.playBarHeight}px` }}>
      <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
        <ArrowBackIcon />
      </IconButton>
      <br />
      {animating? 
                <motion.div variants={togglesVariants}
                initial="hidden"
                animate="visible">
                  <Typography variant="h2" style={{ textAlign: "center" }}>Mixtapes of the Day ({todaysDate.getMonth()+1}/{todaysDate.getDate()}/{todaysDate.getFullYear().toString().substring(2)})</Typography>
                </motion.div>
                :<Typography variant="h2" style={{ textAlign: "center" }}>Mixtapes of the Day ({todaysDate.getMonth()+1}/{todaysDate.getDate()}/{todaysDate.getFullYear().toString().substring(2)})</Typography>
            }
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
        <Box style={{
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
