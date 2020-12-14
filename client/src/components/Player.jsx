import React, { useContext, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import { makeStyles, Card, CardContent, CardMedia, Grid, Typography, IconButton, Slider as VolumeSlider } from '@material-ui/core';
import { Mood as AnimatingIcon, Loop as LoopIcon, Shuffle as ShuffleIcon, Equalizer as AtmosphereSoundsIcon } from '@material-ui/icons';
import ReactPlayer from 'react-player';
import { useInterval } from '../hooks';
import CurrentSongContext from '../contexts/CurrentSongContext';
import PlayingSongContext from '../contexts/PlayingSongContext';
import PlayerAnimationContext from '../contexts/PlayerAnimationContext';
import AtmosphereSoundContext from '../contexts/AtmosphereSoundContext';
import { getMixtapeCoverImageUrl } from '../utils/api';
import { Direction, FormattedTime, PlayerIcon, Slider } from 'react-player-controls';
import { motion } from 'framer-motion';

const WHITE_SMOKE = '#eee'
const GRAY = '#878c88'
const GREEN = '#72d687'

const SliderBar = ({ direction, value, style }) => (
  <div
    style={Object.assign({}, {
      position: 'absolute',
      background: GRAY,
      borderRadius: 4,
    }, direction === Direction.HORIZONTAL ? {
      top: 0,
      bottom: 0,
      left: 0,
      width: `${value * 100}%`,
    } : {
        right: 0,
        bottom: 0,
        left: 0,
        height: `${value * 100}%`,
      }, style)}
  />
)

const SliderHandle = ({ direction, value, style }) => (
  <div
    style={Object.assign({}, {
      position: 'absolute',
      width: 16,
      height: 16,
      background: GREEN,
      borderRadius: '100%',
      transform: 'scale(1)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.3)',
      }
    }, direction === Direction.HORIZONTAL ? {
      top: 0,
      left: `${value * 100}%`,
      marginTop: -4,
      marginLeft: -8,
    } : {
        left: 0,
        bottom: `${value * 100}%`,
        marginBottom: -8,
        marginLeft: -4,
      }, style)}
  />
)

const ProgressBar = ({ isEnabled, direction, value, ...props }) => (
  <Slider
    direction={direction}
    onChange={(value) => console.log(value)}
    style={{
      width: '60%',//=direction === Direction.HORIZONTAL ? 500 : 8,
      height: direction === Direction.HORIZONTAL ? 8 : 130,
      borderRadius: 4,
      background: WHITE_SMOKE,
      transition: direction === Direction.HORIZONTAL ? 'width 0.1s' : 'height 0.1s',
      cursor: isEnabled === true ? 'pointer' : 'default',
    }}
    {...props}
  >
    <SliderBar direction={direction} value={value} style={{ background: isEnabled ? GREEN : GRAY }} />
    <SliderHandle direction={direction} value={value} style={{ background: isEnabled ? GREEN : GRAY }} />
  </Slider>
)

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '95%',
    fontSize: '0.9em',
    margin: 'auto',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    objectFit: 'contain',
    width: '60%',
  },
}));

function Player(props) {
  const classes = useStyles();

  const playerRef = useRef();

  const [currentTime, setCurrentTime] = useState(null);

  const { currentSong, setCurrentSong } = useContext(CurrentSongContext);

  const currentSongRef = useRef();
  useEffect(() => currentSongRef.current = currentSong, [currentSong]);

  const { playing, setPlaying } = useContext(PlayingSongContext);
  const { animating, setAnimating } = useContext(PlayerAnimationContext);

  useInterval(() => {
    if (playerRef.current && playing) {
      const time = playerRef.current.getCurrentTime();
      setCurrentTime(time);
      localStorage.setItem('timestamp', time);
    } else if (playerRef.current) {
      const time = playerRef.current.getCurrentTime();
      setCurrentTime(time);
    }
  }, 500);

  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);

  const handleAnimation = () => {
    if (animating == true) {
      setAnimating(false);
    }
    else {
      setAnimating(true);
    }
  }
  const handlePlay = () => {
    if (currentSong.disabled === currentSong.mixtape._id) {
      return;
    }
    setPlaying(true);
    if (!currentTime) {
      playerRef.current.seekTo(parseFloat(localStorage.getItem('timestamp')));
    }
  };

  const handlePause = () => {
    setPlaying(false);
    const stoppedAt = playerRef.current.getCurrentTime();
    setCurrentTime(stoppedAt);
  };

  const handleNextSong = () => {
    setPlaying(false);
    const newCurrentSong = { ...currentSong };
    if (shuffle) {
      newCurrentSong.index = Math.floor(Math.random() * currentSong.mixtape.songs.length);
    } else if (currentSong.index === currentSong.mixtape.songs.length - 1) {
      newCurrentSong.index = 0;
    } else {
      newCurrentSong.index = currentSong.index + 1;
    }
    setCurrentSong(newCurrentSong);
    setPlaying(true);
  };

  const handlePrevSong = () => {
    setPlaying(false);
    const newCurrentSong = { ...currentSong };
    if (shuffle) {
      newCurrentSong.index = Math.floor(Math.random() * currentSong.mixtape.songs.length);
    } else if (currentSong.index === 0) {
      newCurrentSong.index = currentSong.mixtape.songs.length - 1;
    } else {
      newCurrentSong.index = currentSong.index - 1;
    }
    setCurrentSong(newCurrentSong);
    setPlaying(true);
  };

  const togglesVariants = {
    hidden: {
      scale: 1
    },
    visible: {
      scale: 1.5,
      transition: {
        yoyo: Infinity
      }
    }
  }
  const playVariants = {
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

  const handleSetLoop = () => {
    const loopState = loop;
    setLoop(!loopState);
    if (!loopState) {
      setShuffle(false);
    }
  }

  const handleSetShuffle = () => {
    const shuffleState = shuffle;
    if (!shuffleState) {
      setLoop(false);
    }
    setShuffle(!shuffleState);
  }

  const seek = (time) => {
    const seekTo = time * playerRef.current.getDuration();
    playerRef.current.seekTo(seekTo);
  }

  const { atmosphereSound, setAtmosphereSound } = useContext(AtmosphereSoundContext);

  const atmosphereButtonHandler = () => {
    const newSound = { ...atmosphereSound };
    newSound.isPlaying = !newSound.isPlaying;
    setAtmosphereSound(newSound);
  }

  const [atmosphereVolume, setAtmosphereVolume] = useState(0.5);

  const [musicVolume, setMusicVolume] = useState(0.5);

  const handleAtmosphereVolumeChange = (event, newValue) => {
    setAtmosphereVolume(newValue);
  };

  const handleMusicVolumeChange = (event, newValue) => {
    setMusicVolume(newValue);
  };

  if (!currentSong?.index && currentSong.index !== 0) {
    return null;
  }

  return (
    <div>
      <Grid container alignItems="center">
        <Grid item xs={2} style={{height: '60%'}}>
          <Card className={classes.root}>
            <CardMedia
              className={classes.cover}
              image={currentSong?.mixtape?.songs[currentSong?.index]?.coverImage}
              title={currentSong?.mixtape?.songs[currentSong?.index]?.name}
            />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography variant="h7">
                  {currentSong?.mixtape?.songs[currentSong?.index]?.name}
                </Typography>
              </CardContent>
            </div>

          </Card>
        </Grid>
        <Grid item xs={10}>
          <Grid container justify="center">
            <div style={{ color: 'black', marginRight: '20px' }}>
              <FormattedTime numSeconds={currentTime} />
            </div>
            <ProgressBar
              isEnabled
              direction={Direction.HORIZONTAL}
              value={currentSong?.mixtape?.songs[currentSong?.index].duration ? (currentTime / currentSong?.mixtape.songs[currentSong?.index].duration) : 0}
              onChange={value => seek(value)}
            />
            <div style={{ color: 'black', marginRight: '20px' }}>
              <FormattedTime numSeconds={currentSong?.mixtape?.songs[currentSong?.index].duration ? ((currentSong?.mixtape?.songs[currentSong?.index].duration - currentTime) * -1) : 0} />
            </div>
          </Grid>
          <Grid style={{ margin: '10px 0' }} container justify="center">
            {animating ?
              <motion.div variants={togglesVariants}
                initial="hidden"
                animate="visible"
                style={{ color: loop ? 'red' : 'black', marginRight: '20px' }}>
                <AnimatingIcon onClick={handleAnimation} />
              </motion.div>
              :
              <div
                style={{ color: loop ? 'red' : 'black', marginRight: '20px' }}>
                <AnimatingIcon onClick={handleAnimation} />
              </div>
            }
            <VolumeSlider
              value={atmosphereVolume}
              onChange={handleAtmosphereVolumeChange}
              defaultValue={0.5}
              step={0.001}
              min={0}
              max={1}
              style={{ width: '10%' }} aria-labelledby="continuous-slider"
              disabled={!atmosphereSound.isPlaying}
            />
            {animating ?
              <motion.div variants={togglesVariants}
                initial="hidden"
                animate="visible"
                style={{ color: shuffle ? 'red' : 'black', marginRight: '20px' }}>
                <AtmosphereSoundsIcon
                  style={{ color: atmosphereSound.isPlaying ? 'blue' : '' }}
                  onClick={atmosphereButtonHandler}
                />
              </motion.div>
              :
              <div
                style={{ color: shuffle ? 'red' : 'black', marginRight: '20px' }}>
                <AtmosphereSoundsIcon
                  style={{ color: atmosphereSound.isPlaying ? 'blue' : '' }}
                  onClick={atmosphereButtonHandler}
                />
              </div>
            }
            {animating ?
              <motion.div
                variants={playVariants}
                initial="hidden"
                animate="visible">
                <PlayerIcon.Previous onClick={handlePrevSong} width={32} height={32} style={{ marginRight: 32 }} />
                {playing ?
                  <PlayerIcon.Pause onClick={throttle(handlePause, 1000)} width={32} height={32} style={{ marginRight: 32 }} /> :
                  <PlayerIcon.Play
                    onClick={throttle(handlePlay, 1000)} width={32} height={32} style={{ marginRight: 32 }} />
                }
                <PlayerIcon.Next onClick={handleNextSong} width={32} height={32} style={{ marginRight: 32 }} />
              </motion.div>
              :
              <div>
                <PlayerIcon.Previous onClick={handlePrevSong} width={32} height={32} style={{ marginRight: 32 }} />
                {playing ?
                  <PlayerIcon.Pause onClick={throttle(handlePause, 1000)} width={32} height={32} style={{ marginRight: 32 }} /> :
                  <PlayerIcon.Play
                    onClick={throttle(handlePlay, 1000)} width={32} height={32} style={{ marginRight: 32 }} />
                }
                <PlayerIcon.Next onClick={handleNextSong} width={32} height={32} style={{ marginRight: 32 }} />
              </div>
            }

            {animating ?
              <motion.div variants={togglesVariants}
                initial="hidden"
                animate="visible"
                style={{ color: shuffle ? 'red' : 'black', marginRight: '20px' }}>
                <ShuffleIcon onClick={handleSetShuffle} />
              </motion.div>
              :
              <div
                style={{ color: shuffle ? 'red' : 'black', marginRight: '20px' }}>
                <ShuffleIcon onClick={handleSetShuffle} />
              </div>
            }
            {animating ?
              <motion.div variants={togglesVariants}
                initial="hidden"
                animate="visible"
                style={{ color: loop ? 'red' : 'black', marginRight: '20px' }}>
                <LoopIcon onClick={handleSetLoop} />
              </motion.div>
              :
              <div
                style={{ color: loop ? 'red' : 'black', marginRight: '20px' }}>
                <LoopIcon onClick={handleSetLoop} />
              </div>
            }



            <VolumeSlider
              value={musicVolume}
              onChange={handleMusicVolumeChange}
              defaultValue={0.5}
              step={0.001}
              min={0}
              max={1}
              style={{ width: '20%' }} aria-labelledby="continuous-slider"
            />
          </Grid>
        </Grid>
      </Grid>
      <ReactPlayer
        onEnded={() => loop ? playerRef.current.seekTo(0) : handleNextSong()}
        ref={playerRef} playing={playing} style={{ display: 'none' }}
        url={currentSong?.mixtape?.songs[currentSong.index].playbackUrl}
        volume={musicVolume}
      />
      <ReactPlayer
        loop
        playing={atmosphereSound.isPlaying} style={{ display: 'none' }}
        url={atmosphereSound.filename}
        volume={atmosphereVolume}
      />
    </div>
  )
}

export default Player;
