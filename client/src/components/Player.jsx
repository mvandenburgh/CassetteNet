import React, { useContext, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import { Grid, Slider as VolumeSlider } from '@material-ui/core';
import { Loop as LoopIcon, Shuffle as ShuffleIcon, Equalizer as AtmosphereSoundsIcon } from '@material-ui/icons';
import ReactPlayer from 'react-player';
import { useInterval } from '../hooks';
import CurrentSongContext from '../contexts/CurrentSongContext';
import PlayingSongContext from '../contexts/PlayingSongContext';
import AtmosphereSoundContext from '../contexts/AtmosphereSoundContext';
import SocketIOContext from '../contexts/SocketIOContext';
import { Direction, FormattedTime, PlayerIcon, Slider } from 'react-player-controls';

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
      width: '80%',//=direction === Direction.HORIZONTAL ? 500 : 8,
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


function Player(props) {
  const playerRef = useRef();

  const [currentTime, setCurrentTime] = useState(0);

  const { currentSong, setCurrentSong } = useContext(CurrentSongContext);

  const currentSongRef = useRef();
  useEffect(() => currentSongRef.current = currentSong, [currentSong]);

  const { playing, setPlaying } = useContext(PlayingSongContext);

  useInterval(() => {
    if (playerRef.current && playing) {
      const time = playerRef.current.getCurrentTime()
      setCurrentTime(time);
      localStorage.setItem('timestamp', time);
    }
  }, 500);

  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);

  const handlePlay = () => {
    if (currentSong.disabled === currentSong.mixtape._id) {
      return;
    }
    setPlaying(true);
    if (!currentTime && !currentSong.listeningRoom) {
      playerRef.current.seekTo(parseFloat(localStorage.getItem('timestamp')));
    }
  };

  const handlePause = () => {
    if (currentSong.listeningRoom && !currentSong.listeningRoomOwner) {
      return;
    }
    setPlaying(false);
    const stoppedAt = playerRef.current.getCurrentTime();
    setCurrentTime(stoppedAt);
  };

  const handleNextSong = () => {
    if (currentSong.listeningRoom && !currentSong.listeningRoomOwner) {
      return;
    }
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
    if (currentSong.listeningRoom && !currentSong.listeningRoomOwner) {
      return;
    }
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

  const handleSetLoop = () => {
    if (currentSong.listeningRoom && !currentSong.listeningRoomOwner) {
      return;
    }
    const loopState = loop;
    setLoop(!loopState);
    if (!loopState) {
      setShuffle(false);
    }
  }

  const handleSetShuffle = () => {
    if (currentSong.listeningRoom && !currentSong.listeningRoomOwner) {
      return;
    }
    const shuffleState = shuffle;
    if (!shuffleState) {
      setLoop(false);
    }
    setShuffle(!shuffleState);
  }

  const seek = (time) => {
    if (currentSong.listeningRoom) {
      return;
    }
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

  if (!currentSong?.index) {
    return null;
  }

  return (
    <div>
      <Grid style={{ margin: '10px 0' }} container justify="center">
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
        <VolumeSlider
          value={atmosphereVolume}
          onChange={handleAtmosphereVolumeChange}
          defaultValue={0.5}
          step={0.001}
          min={0}
          max={1}
          style={{ width: '10%' }} aria-labelledby="continuous-slider"
        />
        <div style={{ color: shuffle ? 'red' : 'black', marginRight: '20px' }}>
          <AtmosphereSoundsIcon
            style={{ color: atmosphereSound.isPlaying ? 'blue' : '' }}
            onClick={atmosphereButtonHandler}
          />
        </div>
        <PlayerIcon.Previous onClick={handlePrevSong} width={32} height={32} style={{ marginRight: 32 }} />
        {playing ?
          <PlayerIcon.Pause onClick={currentSong?.listeningRoom ? undefined : throttle(handlePause, 1000)} width={32} height={32} style={{ marginRight: 32 }} /> :
          <PlayerIcon.Play onClick={!currentSong?.listeningRoom ? undefined : throttle(handlePlay, 1000)} width={32} height={32} style={{ marginRight: 32 }} />
        }
        <PlayerIcon.Next onClick={handleNextSong} width={32} height={32} style={{ marginRight: 32 }} />
        <div style={{ color: shuffle ? 'red' : 'black', marginRight: '20px' }}>
          <ShuffleIcon onClick={currentSong?.listeningRoom ? undefined : handleSetShuffle} />
        </div>
        <div style={{ color: loop ? 'red' : 'black', marginRight: '20px' }}>
          <LoopIcon onClick={currentSong?.listeningRoom ? undefined : handleSetLoop} />
        </div>
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
