import React, { createRef, useContext, useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { Loop as LoopIcon, Shuffle as ShuffleIcon } from '@material-ui/icons';
import ReactPlayer from 'react-player';
import CurrentSongContext from '../contexts/CurrentSongContext';
import PlayingSongContext from '../contexts/PlayingSongContext';
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
    const playerRef = createRef(null);

    const [currentTime, setCurrentTime] = useState(null);

    setInterval(() => {
        if (playerRef.current && playing) {
            localStorage.setItem('timestamp', playerRef.current.getCurrentTime());
        }
    }, 2000);

    setInterval(() => {
        if (playerRef.current && playing) {
            setCurrentTime(playerRef.current.getCurrentTime());
        }
    }, 500);

    const { currentSong, setCurrentSong } = useContext(CurrentSongContext);

    const { playing, setPlaying } = useContext(PlayingSongContext);

    const [shuffle, setShuffle] = useState(false);
    const [loop, setLoop] = useState(false);
  
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
        setCurrentTime(playerRef.current.getCurrentTime());
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

    useEffect(() => {
      if (playerRef && currentSong) {
        currentSong.duration = playerRef.current.getDuration();
        setCurrentSong(currentSong);
      }
    })

    const seek = (time) => {
        playerRef.current.seekTo(time * playerRef.current.getDuration());
    }

    return (
        <div style={{height: '100px'}}>
            <Grid style={{margin: '10px 0'}} container justify="center">
              <div style={{color: 'black', marginRight: '20px'}}>
                <FormattedTime numSeconds={currentTime} />
              </div>
                <ProgressBar
                isEnabled
                direction={Direction.HORIZONTAL}
                value={currentSong?.duration ? (currentTime / currentSong.duration) : 0}
                onChange={value => seek(value)}
                />
              <div style={{color: 'black', marginRight: '20px'}}>
                <FormattedTime numSeconds={currentSong?.duration ? ((currentSong.duration - currentTime) * -1) : 0} />
              </div>
            </Grid>
            <Grid style={{margin: '10px 0'}} container justify="center">
                <PlayerIcon.Previous onClick={handlePrevSong} width={32} height={32} style={{ marginRight: 32 }} />
                {playing ?
                <PlayerIcon.Pause onClick={handlePause} width={32} height={32} style={{ marginRight: 32 }} /> :
                <PlayerIcon.Play onClick={handlePlay} width={32} height={32} style={{ marginRight: 32 }} />
                }
                <PlayerIcon.Next onClick={handleNextSong} width={32} height={32} style={{ marginRight: 32 }} />
                <div style={{color: shuffle ? 'red' : 'black', marginRight: '20px'}}>
                  <ShuffleIcon onClick={handleSetShuffle} />
                </div>
                <div style={{color: loop ? 'red' : 'black', marginRight: '20px'}}>
                  <LoopIcon onClick={handleSetLoop} />
                </div>
            </Grid>

            <ReactPlayer onEnded={() => loop ? playerRef.current.seekTo(0) : handleNextSong()} ref={playerRef} playing={playing} style={{display: 'none'}} url={`https://www.youtube.com/watch?v=${currentSong?.mixtape?.songs ? currentSong.mixtape.songs[currentSong.index].id : ''}`} />
        </div>
    )
}

export default Player;
