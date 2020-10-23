import React, { useContext } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import logo from '../../images/logo.png';
import UserContext from '../../contexts/UserContext';

function DashboardPage(props) {
    const colors = {
        buttonContainer: '#0A1941',
    }
    const { user, setUser } = useContext(UserContext);

    return (
        <div style={{color: 'white', left: 0}}>
            <div style={{margin: 'auto', width: '50%'}}>
                <img style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src={logo} alt='logo' />
                <Typography align="center" variant="h4">Mix freely.</Typography>
                <Typography align="center" variant="h4">Connect and collaborate.</Typography>
                <Typography align="center" variant="h4">Press play.</Typography>
            </div>
            <br />
        </div>
    );
}

export default DashboardPage;
