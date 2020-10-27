import React from 'react';

const PlayingSongContext = React.createContext({
    playing: {},
    setPlaying: () => {},
});

export default PlayingSongContext;
