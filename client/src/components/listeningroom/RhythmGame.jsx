import React, { useContext, useEffect, useState } from 'react';
import PlayingSongContext from '../../contexts/PlayingSongContext';
import SocketIOContext from '../../contexts/SocketIOContext';
import UserContext from '../../contexts/UserContext';
import { useEventListener, useInterval } from '../../hooks';
import { Typography } from '@material-ui/core';
import { Spring } from 'react-spring/renderprops';


const BOX_WIDTH = 90; // width of animated boxes in pixels

function RhythmGame({ songStarted, gameScreenStartX, gameScreenEndX, gameScreenStartY, gameScreenEndY, gameScreenHeight, gameScreenWidth, listeningRoom, scores, setScores }) {
    const [bpm, setBpm] = useState(-1);
    const bps = bpm / 60; // beats per second
    const beatDuration = 1 / bps; // how long a square should take to get from the beginning of screen to middle

    const [firstBeatDone, setFirstBeatDone] = useState(false);

    const [startNewAnimation, setStartNewAnimation] = useState(false);

    const [onBeat, setOnBeat] = useState(false);

    const [score, setScore] = useState(0);

    const { user } = useContext(UserContext);

    const { playing, setPlaying } = useContext(PlayingSongContext);

    const { socket } = useContext(SocketIOContext);

    useEffect(() => {
        if (!playing) {
            setScore(0);
        }
    }, [playing]);

    const onAnimationEnd = (a) => {
        setStartNewAnimation(true)
        setFirstBeatDone(true);
    };

    useEffect(() => {
        setBpm(listeningRoom.mixtape.songs[listeningRoom.currentSong].tempo / 2);
        setStartNewAnimation(true);
    }, [listeningRoom]);

    useEventListener('keypress', (e) => {
        if (e.repeat) {
            return;
        } else if (e.code === 'Space') {
            e.preventDefault();
            if (onBeat) {
                setScore(score + 1);
                const newScores = [...scores];
                for (const s of newScores) {
                    if (s.user === user._id) {
                        s.score++;
                        break;
                    }
                }
                socket.emit('rhythmScoreChange', 1);
                console.log('point!')
            } else {
                if (score > 0) {
                    setScore(score - 1)
                    const newScores = [...scores];
                    for (const s of newScores) {
                        if (s.user === user._id) {
                            s.score--;
                            break;
                        }
                    }
                    socket.emit('rhythmScoreChange', -1);
                }
                console.log('miss!')
            }
        }
    });

    if (!songStarted || !gameScreenStartX || !gameScreenEndX || bpm < 0 || !playing) {
        // setScore(0);
        return null;
    }

    const c1Style = {
        background: onBeat ? 'red' : 'steelblue',
        color: 'white',
        height: '100px',
        width: `${BOX_WIDTH}px`,
    }

    const c2Style = {
        background: 'steelblue',
        color: 'white',
        height: '100px',
        width: `${BOX_WIDTH}px`,
    }

    return (
        <div>
            <Typography variant="h1" style={{ float: 'right' }}>{score}</Typography>
            <div style={{ position: 'absolute', left: gameScreenStartX, width: gameScreenWidth, height: '100px', backgroundColor: 'yellow', top: `${gameScreenEndY - (gameScreenHeight / 2)}px`, }}>

            </div>
            <Spring
                from={{ position: 'absolute', left: gameScreenStartX }}
                to={{ position: 'absolute', left: ((gameScreenEndX + gameScreenStartX) / 2) - (BOX_WIDTH / 2) }}
                config={{ duration: beatDuration * 1000 }}
                reset={startNewAnimation}
                onRest={onAnimationEnd}
                onFrame={s => s.left > (gameScreenStartX + (gameScreenWidth / 2) - (BOX_WIDTH / 2) * 2) ? setOnBeat(true) : undefined}
                onStart={() => setStartNewAnimation(false)}
            >
                {props => (
                    <div style={props}>
                        <div style={{ position: 'absolute', left: `${props.x}px`, top: `${gameScreenHeight / 3}px`, ...c2Style }} />
                    </div>
                )}
            </Spring>
            {firstBeatDone ?
                <Spring
                    from={{ position: 'absolute', left: ((gameScreenEndX + gameScreenStartX) / 2) - (BOX_WIDTH / 2) }}
                    to={{ position: 'absolute', left: gameScreenEndX - BOX_WIDTH }}
                    config={{ duration: beatDuration * 1000 }}
                    reset={startNewAnimation}
                    // onStart={() => setOnBeat(true)}
                    onFrame={(s) => s.left > ((gameScreenEndX + gameScreenStartX) / 2) - (BOX_WIDTH / 2) + 200 ? setOnBeat(false) : undefined}
                // onFrame={(s) => console.log(s.left, ((gameScreenEndX+gameScreenStartX)/2)-(BOX_WIDTH/2) + 20)}
                >
                    {props => (
                        <div style={props}>
                            <div style={{ position: 'absolute', left: `${props.x}px`, top: `${gameScreenHeight / 3}px`, ...c1Style }} />
                        </div>
                    )}
                </Spring>
                : undefined}
        </div>
    )
}

export default RhythmGame;
