import React from 'react';

const NavigateContext = React.createContext({
    navigate: {},
    setNavigate: () => {},
});

export default NavigateContext;
