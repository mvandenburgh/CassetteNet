import React, { useContext, useState } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import UserContext from '../contexts/UserContext';


function Directory() {
    // const { setUser } = useContext(UserContext);
    // setUser({ username: 'Guest', isGuest: true, isLoggedIn: false });
    const history = useHistory();

    //history.push('/');

    const goLogin = () => {  
                            history.push('/login');
                            };

    return (
        <div style={{position: 'relative'}}>

            <Button onClick={ () => history.push('/start') } variant="outlined" style={{margin: '1em'}}>Start Page</Button>
            <br/>
            <Button onClick={ () => history.push('/login') } variant="outlined" style={{margin: '1em'}}>Login Page</Button>
            <br/>
            <Button onClick={ () => history.push('/atmosphere') } variant="outlined" style={{margin: '1em'}}>Atmosphere Page</Button>
            <br/>
            <Button onClick={ () => history.push('/mixtape/:id') } variant="outlined" style={{margin: '1em'}}>View Mixtape Page</Button>
            <br/>
            <Button onClick={ () => history.push('/mymixtapes') } variant="outlined" style={{margin: '1em'}}>My Mixtapes Page</Button>
            <br/>
            <Button onClick={ () => history.push('/inbox') } variant="outlined" style={{margin: '1em'}}>Inbox Page</Button>
            <br/>
            <Button onClick={ () => history.push('/NotFound') } variant="outlined" style={{margin: '1em'}}>Not Found Page</Button>
            <br/>
            <Button onClick={ () => history.push('/SignUp') } variant="outlined" style={{margin: '1em'}}>Sign Up Page</Button>

            
        </div>
    );
}

export default Directory;