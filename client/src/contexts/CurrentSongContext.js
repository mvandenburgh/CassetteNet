import React from 'react';

const CurrentSongContext = React.createContext({
    song: {}, // { mixtapeId, songIndex }
    setSong: () => {},
});

export default CurrentSongContext;
