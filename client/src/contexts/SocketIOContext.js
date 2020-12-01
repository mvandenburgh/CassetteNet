import React from 'react';

const SocketIOContext = React.createContext({
    socket: {},
    setSocket: () => {},
});

export default SocketIOContext;
