import React, { useContext } from 'react';
import { Button, Grid, Card, Paper, Box, Typography } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { DataGrid } from '@material-ui/data-grid';
import logo from '../../images/logo.png';
import { makeStyles } from "@material-ui/core/styles";
import UserContext from '../../contexts/UserContext';

function DashboardPage(props) {
    const colors = {
        buttonContainer: '#0A1941',
        mixtapeRows: '#1c108f'
    }

    const useStyles = makeStyles((theme) => ({
        grid: {
            width: '100%',
            margin: '50px'
        },
        paper: {
            padding: theme.spacing(2),
            margin: '10px',
            textAlign: 'center',
            color:  'white',//theme.palette.text.secondary,
            background: colors.mixtapeRows,
        },
        card: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color:  theme.palette.text.secondary,
            background: theme.palette.success.light,
        },
        box: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color:  theme.palette.info.contrastText,
            background: blueGrey[800],
            minWidth: '50%',
            height: '100%'
        }
    }));

    const classes = useStyles();

    const { user, setUser } = useContext(UserContext);

    return (
        <div style={{color: 'white', left: 0, height: '100%'}}>
            <Grid container spacing={1} className={classes.grid}>
                <Box className={classes.box}> 
                    <Typography variant="headline" component="h1">
                        Popular Mixtapes This Week
                    </Typography>
                    <Grid item xs={12} md={12}>
                        <Paper className={classes.paper}>
                            <div display='inline-block'>
                                <Typography variant="headline" component="h4" align='left'>Title</Typography>
                                <Typography variant="headline" component="h4" align='center'>Collaborators</Typography>
                                <Typography variant="headline" component="h4" align='right'>Favorites</Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper className={classes.paper}>
                            Blocc 2
                        </Paper>
                    </Grid>
                </Box>

            </Grid>
            <br />
        </div>
    );
}

export default DashboardPage;
