import React, { Component } from 'react';
import { AppBar, Box, Grid, Tabs, Tab, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Mixtape from '../Mixtape';


// const mixtape = JSON.parse('"{"_id":"5f86204f496f3470bbf40a83","name":"Evening Acoustic","public":false,"collaborators":[{"user":"5f862052790b506769c6a0dc","permissions":"owner"}],"songs":[{"id":"GT4IC9fgxiw","name":"The Staves - Make It Holy [Official Video]"},{"id":"GhDnyPsQsB0","name":"Bon Iver - re: Stacks"},{"id":"qUG7iUnbtdA","name":"Puzzle Muteson - By Night"},{"id":"-BufEpzy1Vc","name":"Marissa Nadler~Baby, I Will Leave You In The Morning"}],"coverImage":"https://i.scdn.co/image/ab67706f00000003bdd580456b856d8e1176ffb1"}"');


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box p={3}>
            <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
}));

class ListeningRoomPage extends Component {
    state = {
        currentTab: 0
    };

    handleChange(event, newValue) {
        this.setState({currentTab: newValue});
    };

    render() {
        

        return (
            <div>
                <Grid style={{padding: '5%'}} container justify="center">
                    <Grid item style={{width: '80%'}}>
                        <AppBar position="static">
                            <Tabs value={this.state.currentTab} onChange={this.handleChange.bind(this)} centered={true} variant="fullWidth">
                                <Tab label="Listen" {...a11yProps(0)} />
                                <Tab label="Game" {...a11yProps(1)} />
                            </Tabs>
                        </AppBar>
                    </Grid>
                    <Grid item style={{width: '80%', backgroundColor: 'cyan'}}>
                        <TabPanel value={this.state.currentTab} index={0}>
                            {/* <Mixtape mixtape={'5f86204f496f3470bbf40a83'} /> */}
                            <h1>Test</h1>
                        </TabPanel>
                        <TabPanel value={this.state.currentTab} index={1}>

                        </TabPanel>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default ListeningRoomPage;
