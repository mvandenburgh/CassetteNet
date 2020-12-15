import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, IconButton, Typography } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import MixtapeList from '../MixtapeList';
import CurrentSongContext from '../../contexts/CurrentSongContext';
import UserContext from '../../contexts/UserContext';
import { getFavoritedMixtapes } from '../../utils/api';
import { useHistory } from 'react-router-dom';
import PlayerAnimationContext from '../../contexts/PlayerAnimationContext';
import { motion } from 'framer-motion';

function FavoritedMixtapesPage(props) {
    const { user } = useContext(UserContext);
    if (!user?.isLoggedIn) {
        history.push('/');
    }
    const { currentSong } = useContext(CurrentSongContext);
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

    const [mixtapes, setMixtapes] = useState(null);

    useEffect(() => {
        getFavoritedMixtapes(user._id).then(updatedMixtapes => {
            if (!updatedMixtapes) {
                setMixtapes([]);
            } else {
                setMixtapes(updatedMixtapes);
            }
        });
    }, []);

    const history = useHistory();
    const goBack = () => history.goBack();

    if (!mixtapes) {
        return null;
    }

    return (
        <div style={{ color: 'white', left: 0, marginBottom: `${currentSong.playBarHeight}px` }}>
            <IconButton color="secondary" aria-label="back" onClick={goBack}>
                <ArrowBackIcon />
            </IconButton>
            <Grid container justify="center">
            {animating? 
                <motion.div variants={togglesVariants}
                initial="hidden"
                animate="visible">
                <Typography variant="h2">Favorite Mixtapes</Typography>
                </motion.div>
                :
                <Typography variant="h2">Favorite Mixtapes</Typography>
            }
                
                <Box style={{
                    maxHeight: '60vh',
                    overflow: 'auto',
                    display: 'inline-flex',
                    flexDirection: 'row',
                    backgroundColor: blueGrey[900],
                    marginRight: '10px',
                    marginBottom: '30px',
                    paddingLeft: '20px',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    width: '85%',
                    height: '30%'
                }} boxShadow={3} borderRadius={12}>
                    <Grid container justify="center">
                        <MixtapeList mixtapes={mixtapes} setMixtapes={setMixtapes} />
                    </Grid>
                </Box>
            </Grid>
        </div>
    )
}

export default FavoritedMixtapesPage;
