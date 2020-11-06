import React, { useContext } from 'react';
import { Button, Grid, IconButton, Typography } from '@material-ui/core';
import logo from '../../images/logo.png';
import { useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function StartPage(props) {
    const colors = {
        buttonContainer: '#0A1941',
        loginButton: '#115628',
        signUpButton: '#561111',
        guestButton: '#6B6B6B',
    }

    // TODO: add user to destructuring when needed
    // Removed for now to avoid build warnings
    const { user, setUser } = useContext(UserContext);

    const history = useHistory();
    const goBack = () => history.push('/');


    const loginAsGuest = () => setUser({ username: 'Guest', isGuest: true, isLoggedIn: true });
    const loginAsUser = () => setUser({ username: 'User0', isGuest: false, isLoggedIn: true });

    return (
        <div style={{color: 'white', left: 0}}>
            <IconButton color="secondary" aria-label="back"  onClick={goBack}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
            <br/>
            <br/>
            <div style={{margin: 'auto', width: '50%'}}>
                <img style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src={logo} alt='logo' />
                <Typography align="center" variant="h4">Mix freely.</Typography>
                <Typography align="center" variant="h4">Connect and collaborate.</Typography>
                <Typography align="center" variant="h4">Press play.</Typography>
            </div>
            <br />
            <div style={{backgroundColor: 'blue', left: '25%', width: '50%', margin: 'auto'}}>
                <Grid container justify="center" style={{padding: '5%', backgroundColor: colors.buttonContainer}}>
                        <Button onClick={() => history.push('/login')} style={{margin: '1em', backgroundColor: colors.loginButton}} fullWidth variant="contained">LOGIN</Button>
                        <Button onClick={() => history.push('/signup')} style={{margin: '1em', backgroundColor: colors.signUpButton}} fullWidth variant="contained">SIGN UP</Button>
                        <Button onClick={() => loginAsGuest()} style={{margin: '1em', backgroundColor: colors.guestButton}} fullWidth variant="contained">CONTINUE AS GUEST</Button>
                </Grid>
            </div>
        </div>
    );
}

export default StartPage;
