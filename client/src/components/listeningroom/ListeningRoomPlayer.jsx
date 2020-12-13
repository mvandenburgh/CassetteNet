import React, { useContext, useEffect, useRef, useState } from 'react';
import { CircularProgress, Grid, Slider as VolumeSlider, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Loop as LoopIcon, Shuffle as ShuffleIcon, Equalizer as AtmosphereSoundsIcon } from '@material-ui/icons';
import ReactPlayer from 'react-player';
import { useInterval } from '../../hooks';
import UserContext from '../../contexts/UserContext';
import PlayingSongContext from '../../contexts/PlayingSongContext';
import AtmosphereSoundContext from '../../contexts/AtmosphereSoundContext';
import SocketIOContext from '../../contexts/SocketIOContext';
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


function ListeningRoomPlayer({ listeningRoom, setListeningRoom, rhythmGame, setSongStarted }) {
    const playerRef = useRef();

    const { socket } = useContext(SocketIOContext);

    const [currentTime, setCurrentTime] = useState(0);

    const { user } = useContext(UserContext);

    const { playing, setPlaying } = useContext(PlayingSongContext);

    const [rhythmGameStartingPopup, setRhythmGameStartingPopup] = useState(false);

    useInterval(() => {
        if (playerRef.current && playing && listeningRoom?.startedAt && listeningRoom?.wasAt) {
            const time = ((Date.now() / 1000) - listeningRoom.startedAt) + listeningRoom.wasAt;
            if (time > listeningRoom?.mixtape.songs[listeningRoom?.currentSong]?.duration) {
                setCurrentTime(listeningRoom?.mixtape.songs[listeningRoom?.currentSong]?.duration);
            } else if (time >= 0) {
                setCurrentTime(time);
                if (rhythmGame && listeningRoom?.mixtape.songs[listeningRoom?.currentSong]?.duration - currentTime <= 6) {
                    setRhythmGameStartingPopup(true);
                }
            } else if (time < 0) {
                setCurrentTime(0);
            }
        }
    }, 500);

    const [shuffle, setShuffle] = useState(false);
    const [loop, setLoop] = useState(false);

    const handleNextSong = () => {
        if (user._id !== listeningRoom.owner.user) {
            return;
        }
        setPlaying(false);
        const newListeningRoom = { ...listeningRoom };
        if (shuffle) {
            newListeningRoom.currentSong = Math.floor(Math.random() * newListeningRoom.mixtape.songs.length);
        } else if (newListeningRoom.currentSong === newListeningRoom.mixtape.songs.length - 1) {
            newListeningRoom.currentSong = 0;
        } else if (!loop) {
            newListeningRoom.currentSong = newListeningRoom.currentSong + 1;
        }
        socket.emit('changeSong', newListeningRoom.currentSong);
    };

    const handlePrevSong = () => {
        if (user._id !== listeningRoom.owner.user) {
            return;
        }
        setPlaying(false);
        const newListeningRoom = { ...listeningRoom };
        if (shuffle) {
            newListeningRoom.currentSong = Math.floor(Math.random() * newListeningRoom.mixtape.songs.length);
        } else if (newListeningRoom.currentSong === 0) {
            newListeningRoom.currentSong = newListeningRoom.mixtape.songs.length - 1;
        } else if (!loop) {
            newListeningRoom.currentSong = newListeningRoom.currentSong - 1;
        }
        socket.emit('changeSong', newListeningRoom.currentSong);
    };

    const handleSetLoop = () => {
        if (user._id !== listeningRoom.owner.user) {
            return;
        }
        const loopState = loop;
        setLoop(!loopState);
        if (!loopState) {
            setShuffle(false);
        }
    }

    const handleSetShuffle = () => {
        if (user._id !== listeningRoom.owner.user) {
            return;
        }
        const shuffleState = shuffle;
        if (!shuffleState) {
            setLoop(false);
        }
        setShuffle(!shuffleState);
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

    return (
        <div>
            <Grid style={{ margin: '10px 0' }} container justify="center">
                <div style={{ color: 'black', marginRight: '20px' }}>
                    <FormattedTime numSeconds={currentTime} />
                </div>
                <ProgressBar
                    isEnabled
                    direction={Direction.HORIZONTAL}
                    value={listeningRoom?.mixtape.songs[listeningRoom?.currentSong]?.duration ? (currentTime / listeningRoom?.mixtape.songs[listeningRoom?.currentSong]?.duration) : 0}
                />
                <div style={{ color: 'black', marginRight: '20px' }}>
                    <FormattedTime numSeconds={listeningRoom?.mixtape.songs[listeningRoom?.currentSong]?.duration ? ((listeningRoom?.mixtape.songs[listeningRoom?.currentSong]?.duration - currentTime) * -1) : 0} />
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
                {playing ? <>
                        <PlayerIcon.Previous onClick={handlePrevSong} width={32} height={32} style={{ marginRight: 32 }} />
                        <PlayerIcon.Next onClick={handleNextSong} width={32} height={32} style={{ marginRight: 32 }} />
                        <div style={{ color: shuffle ? 'red' : 'black', marginRight: '20px' }}>
                            <ShuffleIcon onClick={handleSetShuffle} />
                        </div>
                        <div style={{ color: loop ? 'red' : 'black', marginRight: '20px' }}>
                            <LoopIcon onClick={handleSetLoop} />
                        </div>
                <VolumeSlider
                    value={musicVolume}
                    onChange={handleMusicVolumeChange}
                    defaultValue={0.5}
                    step={0.001}
                    min={0}
                    max={1}
                    style={{ width: '20%' }} aria-labelledby="continuous-slider"
                /> </>
                : <CircularProgress />}
            </Grid>
            <ReactPlayer
                onEnded={handleNextSong}
                ref={playerRef} playing={playing} style={{ display: 'none' }}
                url={listeningRoom?.mixtape.songs[listeningRoom?.currentSong]?.listeningRoomPlaybackUrl}
                volume={musicVolume}
                onStart={() => { setSongStarted(true); console.log('started') }}
                onBuffer={() => setSongStarted(false)}
                onBufferEnd={() => setSongStarted(true)}
                onEnded={() => setSongStarted(false)}
            />
            <ReactPlayer
                loop
                playing={atmosphereSound.isPlaying} style={{ display: 'none' }}
                url={atmosphereSound.filename}
                volume={atmosphereVolume}
            />
            <Snackbar
                open={rhythmGameStartingPopup}
                autoHideDuration={8000}
                onClose={() => setRhythmGameStartingPopup(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Alert severity="info">Rhythm game will start in {Math.ceil(listeningRoom?.mixtape.songs[listeningRoom?.currentSong]?.duration - currentTime)}</Alert>
            </Snackbar>
        </div>
    )
}

export default ListeningRoomPlayer;
