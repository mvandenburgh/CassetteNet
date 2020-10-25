import React, { useContext } from 'react';
import { Button, Grid, Card, Box, Typography } from '@material-ui/core';
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
            margin: '25px'
        },
        list: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
            position: 'relative',
            overflow: 'auto',
            maxHeight: 300,
        },
        card: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color:  theme.palette.text.secondary,
            background: theme.palette.success.light,
        },
        box_container: {
            padding: theme.spacing(2),
            margin: '20px',
            textAlign: 'center',
            color:  theme.palette.info.contrastText,
            background: blueGrey[800],
            maxHeight: 400, 
            overflow: 'auto'
        },
        box_row: {
            padding: theme.spacing(2),
            margin: '10px',
            textAlign: 'center',
            color:  'white',//theme.palette.text.secondary,
            background: colors.mixtapeRows,
        }
    }));

    const classes = useStyles();

    const { user, setUser } = useContext(UserContext);

    return (
        <div style={{margin: '20px', background: 'transparent', height: '100%', width: '100%'}}>
            <Box id='popular' className={classes.box_container}> 
                <Typography variant="headline" component="h1">
                    Popular Mixtapes This Week
                </Typography>
                <Box className={classes.box_row}> 
                    blocc 3
                </Box>
                <Box className={classes.box_row}> 
                    blocc 1
                </Box>
                <Box className={classes.box_row}> 
                    blocc 2
                </Box>
                <Box className={classes.box_row}> 
                    blocc A
                </Box>
                <Box className={classes.box_row}> 
                    blocc B
                </Box>
                <Box className={classes.box_row}> 
                    blocc C
                </Box>
            </Box>
            <Box id='follower_activity' className={classes.box_container}> 
                <Typography variant="headline" component="h1">
                    Followed User Activity
                </Typography>
                <Box className={classes.box_row}> 
                    blocc 4
                </Box>
                <Box className={classes.box_row}> 
                    blocc 5
                </Box>
                <Box className={classes.box_row}> 
                    blocc 6
                </Box>
                <Box className={classes.box_row}> 
                    blocc D
                </Box>
                <Box className={classes.box_row}> 
                    blocc E
                </Box>
                <Box className={classes.box_row}> 
                    blocc F
                </Box>
            </Box>
        </div>
    );
}

export default DashboardPage;
