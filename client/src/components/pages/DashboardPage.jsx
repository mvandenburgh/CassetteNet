import React, { useContext } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import logo from '../../images/logo.png';
import UserContext from '../../contexts/UserContext';

function DashboardPage(props) {
    const colors = {
        buttonContainer: '#0A1941',
        mixtapeRows: '#1c108f'
    }
    const { user, setUser } = useContext(UserContext);

    return (
        <div style={{color: 'white', left: 0}}>
            <div style={{margin: 'auto', width: '90%'}}>
            <Grid container
              direction="column"
              justify="center"
              alignItems="center"
              >
                <Grid item xs={2} style={{background:colors.mixtapeRows}}>
                Bread
                </Grid>
                <Grid item xs={2} style={{background:colors.mixtapeRows}}>
                Yogurt
                </Grid>
            </Grid>
            </div>

            <br />
        </div>
    );
}

export default DashboardPage;
