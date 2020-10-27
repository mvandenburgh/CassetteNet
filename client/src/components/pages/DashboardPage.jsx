import React, { useContext } from 'react';
import { Button, Grid, Card, Box, Typography } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { DataGrid } from '@material-ui/data-grid';
import logo from '../../images/logo.png';
import { makeStyles } from "@material-ui/core/styles";
import UserContext from '../../contexts/UserContext';
import HidePageFrameContext from '../../contexts/HidePageFrameContext';
import NavigateContext from '../../contexts/NavigateContext.js';

function DashboardPage(props) {
    const colors = {
        buttonContainer: '#0A1941',
        mixtapeRows: '#1c108f'
    }

    const containerBorderProps = {
        bgcolor: 'background.paper',
        borderColor: blueGrey[800],
        m: 1,
        border: 1,
        boxShadow: 6,
      };

      const rowBorderProps = {
        bgcolor: 'background.paper',
        borderColor: '#1c108f',
        m: 1,
        border: 1,
        boxShadow: 6,
      };

    const useStyles = makeStyles((theme) => ({
        box_container: {
            padding: theme.spacing(2),
            marginLeft: '100px',
            marginRight: '100px',
            marginTop: '50px',
            marginBottom: '50px',
            textAlign: 'center',
            color:  theme.palette.info.contrastText,
            background: blueGrey[800],
            maxHeight: 300, 
            overflow: 'auto'
        },
        box_row: {
            padding: theme.spacing(2),
            margin: '10px',
            textAlign: 'center',
            //display: 'inline',
            color:  'white',//theme.palette.text.secondary,
            background: colors.mixtapeRows,
        },
        title_row: {
            padding: theme.spacing(2),
            margin: '10px',
            color:  'white',//theme.palette.text.secondary,
            background: colors.mixtapeRows,
            height: '50%',
            
        },
        name_col: {
            margin: '10px',
            textAlign: 'left',
            color:  'white',//theme.palette.text.secondary,
            background: colors.mixtapeRows,
        },
        collaborators_col: {
            margin: '10px',
            textAlign: 'center',
            color:  'white',//theme.palette.text.secondary,
            background: colors.mixtapeRows,
        },
        favorites_col: {
            margin: '10px',
            textAlign: 'right',
            color:  'white',//theme.palette.text.secondary,
            background: colors.mixtapeRows,
        },
    }));

    const classes = useStyles();

    const { user, setUser } = useContext(UserContext);

    return (
        <div style={{margin: '20px', background: 'transparent', height: '100%', width: '100%'}}>
            <Box id='popular' className={classes.box_container} borderRadius={16} {...containerBorderProps}> 
                <Typography variant="headline" component="h1">Popular Mixtapes This Week</Typography>
                <Box className={classes.title_row} borderRadius={16} {...rowBorderProps}> 
                    <Typography variant="headline" component="h2"  align="left">
                        Name
                    </Typography>
                    <Typography variant="headline" component="h2"  align="center">
                        Collaborators
                    </Typography>
                    <Typography variant="headline" component="h2" align="right">
                        Favorites
                    </Typography>
                </Box>
                <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                    <Box className={classes.name_col}>summertime</Box>
                    <Box className={classes.collaborators_col}>DrizzyD</Box>
                    <Box className={classes.favorites_col}>109K</Box>
                </Box>
                <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                    blocc 2
                </Box>
                <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                    blocc A
                </Box>
                <Box className={classes.box_row}> 
                    blocc B
                </Box>
                <Box className={classes.box_row}> 
                    blocc C
                </Box>
            </Box>
            <Box id='follower_activity' className={classes.box_container} borderRadius={16} {...containerBorderProps}> 
                <Typography variant="headline" component="h1">
                    Followed User Activity
                </Typography>
                <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                    DrizzyD favorited a mixtape: summertime
                </Box>
                <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                    bob created a new mixtape: bob's hits
                </Box>
                <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
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
