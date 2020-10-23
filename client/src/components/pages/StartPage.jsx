import React, { useContext } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import logo from '../../images/logo.png';
import UserContext from '../../contexts/UserContext';

function StartPage(props) {
    const colors = {
        buttonContainer: '#0A1941',
        loginButton: '#115628',
        signUpButton: '#561111',
        guestButton: '#6B6B6B',
    }
    const { user, setUser } = useContext(UserContext);

    const loginAsGuest = () => setUser({ username: 'Guest', isGuest: true, isLoggedIn: true });
    const loginAsUser = () => setUser({ username: 'User0', isGuest: false, isLoggedIn: true });

    return (
        <div style={{color: 'white', left: 0}}>
            <div style={{margin: 'auto', width: '50%'}}>
                <img style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src={logo} alt='logo' />
                <Typography align="center" variant="h4">Mix freely.</Typography>
                <Typography align="center" variant="h4">Connect and collaborate.</Typography>
                <Typography align="center" variant="h4">Press play.</Typography>
            </div>
            <br />
            <div style={{backgroundColor: 'blue', left: '25%', width: '50%', margin: 'auto'}}>
                <Grid container justify="center" style={{padding: '5%', backgroundColor: colors.buttonContainer}}>
                        <Button onClick={() => loginAsUser()} style={{margin: '1em', backgroundColor: colors.loginButton}} fullWidth variant="contained">LOGIN</Button>
                        <Button style={{margin: '1em', backgroundColor: colors.signUpButton}} fullWidth variant="contained">SIGN UP</Button>
                        <Button onClick={() => loginAsGuest()} style={{margin: '1em', backgroundColor: colors.guestButton}} fullWidth variant="contained">CONTINUE AS GUEST</Button>
                </Grid>
            </div>
        </div>
    );
}

export default StartPage;
