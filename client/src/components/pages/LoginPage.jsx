import React, { useContext, useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import logo from '../../images/logo.png';
import UserContext from '../../contexts/UserContext';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom';
import { getUser } from '../../utils/api';

function LoginPage(props) {
    const colors = {
        buttonContainer: '#0A1941',
        loginButton: '#115628',
        signUpButton: '#561111',
        guestButton: '#6B6B6B',
    }

    const history = useHistory();

    const { user, setUser } = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const loginAsUser = () => {
        const loggedInUser = getUser(username, password);
        console.log(loggedInUser);
        if (loggedInUser) setUser({isLoggedIn: true, isGuest: false, ...loggedInUser});
        history.push('/');
    }

    

    const handleUsername = (e) => setUsername(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    return (
        <div style={{color: 'white', left: 0}}>
            <div style={{margin: 'auto', width: '50%'}}>
                <img style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src={logo} alt='logo' />
            </div>
            <br />
            <div style={{backgroundColor: 'blue', left: '25%', width: '50%', margin: 'auto'}}>
                <Grid container justify="center" style={{padding: '5%', backgroundColor: "#7230ff"}}>
                    <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                            <AccountCircle />
                        </Grid>
                        <Grid item>
                            <TextField onChange={handleUsername} label="Username" margin="normal" />
                        </Grid>
                    </Grid>
                    <TextField onChange={handlePassword} label="Password" margin="normal" />
                    <Button onClick={loginAsUser} style={{margin: '1em', backgroundColor: colors.loginButton}} fullWidth variant="contained">LOGIN</Button>
                </Grid>
            </div>
        </div>
    );
}

export default LoginPage;
