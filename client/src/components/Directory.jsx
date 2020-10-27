import React, { useContext, useState } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import HidePageFrameContext from '../contexts/HidePageFrameContext';
import NavigateContext from '../contexts/NavigateContext';



function Directory() {
    // const { setUser } = useContext(UserContext);
    // setUser({ username: 'Guest', isGuest: true, isLoggedIn: false });
    const { navigate, setNavigate } = useContext(NavigateContext);
    const { hidePF, setHidePF } = useContext(HidePageFrameContext);
    const history = useHistory();

    //history.push('/');

    const goLogin = () => {  setNavigate({ navigate: false });
                            setHidePF({ hidePF: true});
                            history.push('/login');
                            };

    return (
        <div style={{position: 'relative'}}>
            <Button onClick={ history.push('/start') } style={{margin: '1em', backgroundColor: 'red'}} fullWidth variant="contained">Start Page</Button>
            {/* <Button onClick={ history.push('/login') } style={{margin: '1em', backgroundColor: 'blue'}} fullWidth variant="contained">Login Page</Button> */}
            
            <Button variant="outline-primary">Primary</Button>
            <Button variant="outline-secondary">Secondary</Button>
            <Button variant="outline-success">Success</Button>
            <Button variant="outline-warning">Warning</Button>
            <Button variant="outline-danger">Danger</Button>
            <Button variant="outline-info">Info</Button>
            <Button variant="outline-light">Light</Button>
            <Button variant="outline-dark">Dark</Button>
            
        </div>
    );
}

export default Directory;