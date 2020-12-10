import React, { useContext, useEffect, useState } from 'react';
import PlayingSongContext from '../../contexts/PlayingSongContext';
import { Spring } from 'react-spring/renderprops';

function setExactInterval(handler, time) {
    var startTime = Date.now();
    setTimeout(function () {
        while (true) {
            var currentTime = Date.now();
            var diff = currentTime - startTime;
            if (diff >= time) {
                setExactInterval(handler, time);
                return handler();
            }
        }
    }, time - 50);
}

const BOX_WIDTH = 90; // width of animated boxes in pixels

function RhythmGame({ xStart, xEnd, gameScreenHeight, gameScreenWidth, listeningRoom }) {
    const [bpm, setBpm] = useState(-1);
    const bps = bpm / 60; // beats per second
    const beatDuration = 1 / bps; // how long a square should take to get from the beginning of screen to middle

    const [firstBeatDone, setFirstBeatDone] = useState(false);

    const [startNewAnimation, setStartNewAnimation] = useState(false);

    const [red, setRed] = useState(false);

    const { playing, setPlaying } = useContext(PlayingSongContext);

    const onAnimationEnd = (a) => {
        setStartNewAnimation(true)
        setFirstBeatDone(true);
    }

    useEffect(() => {
        setBpm(listeningRoom.mixtape.songs[listeningRoom.currentSong].tempo);
        setStartNewAnimation(true);
    }, [listeningRoom]);

    if (!xStart || !xEnd || bpm < 0 || !playing) {
        return null;
    }

    const c1Style = {
        background: red ? 'red' : 'steelblue',
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
            <Spring
                from={{ position: 'absolute', left: xStart }}
                to={{ position: 'absolute', left: ((xEnd + xStart) / 2) - (BOX_WIDTH / 2) }}
                config={{ duration: beatDuration * 1000 }}
                reset={startNewAnimation}
                onRest={onAnimationEnd}
                onStart={() => setStartNewAnimation(false)}
            >
                {props => (
                    <div style={props}>
                        <div style={{ position: 'absolute', left: `${props.x}px`, top: `${gameScreenHeight/3}px`, ...c2Style }} />
                    </div>
                )}
            </Spring>
            {firstBeatDone ?
                <Spring
                    from={{ position: 'absolute', left: ((xEnd + xStart) / 2) - (BOX_WIDTH / 2) }}
                    to={{ position: 'absolute', left: xEnd - BOX_WIDTH }}
                    config={{ duration: beatDuration * 1000 }}
                    reset={startNewAnimation}
                    onStart={() => setRed(true)}
                    onFrame={(s) => s.left > ((xEnd+xStart)/2)-(BOX_WIDTH/2) + 20 ? setRed(false) : undefined}
                    // onFrame={(s) => console.log(s.left, ((xEnd+xStart)/2)-(BOX_WIDTH/2))}
                >
                    {props => (
                        <div style={props}>
                            <div style={{ position: 'absolute', left: `${props.x}px`, top: `${gameScreenHeight/3}px`, ...c1Style }} />
                        </div>
                    )}
                </Spring>
                : undefined}
        </div>
    )
}

export default RhythmGame;
