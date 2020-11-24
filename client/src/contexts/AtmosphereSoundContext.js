import React from 'react';

const AtmosphereSoundContext = React.createContext({
    atmosphereSound: {}, // { filename, isPlaying }
    setAtmosphereSound: () => {},
});

export default AtmosphereSoundContext;
