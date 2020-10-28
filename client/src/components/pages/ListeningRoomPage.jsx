import React, { Component } from 'react';
import { AppBar, Box, Grid, Paper, Tabs, Tab, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Mixtape from '../Mixtape';
import CurrentSongContext from '../../contexts/CurrentSongContext';


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
    static contextType = CurrentSongContext;

    state = {
        currentTab: 0
    };

    handleChange(event, newValue) {
        this.setState({currentTab: newValue});
    };

    componentDidMount() {
        const { currentSong, setCurrentSong } = this.context;
        setCurrentSong(null);
    }

    render() {
        return (
                <Grid container justify="center">
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
                            <Grid>
                                <Grid item xs={10}>
                                    <Paper>
                                        <Typography>
                                            <h1>{"<Listening Room Name>"}</h1>
                                            <h3>{"Listening to <mixtape_name>"}</h3>
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid style={{height: '50%'}} container>
                                <Grid container xs={9}>
                                    <Mixtape id={'5f86204f496f3470bbf40a83'} />
                                </Grid>
                                <Grid container xs={3} style={{backgroundColor: ''}}>
                                    <Grid item xs={12} style={{backgroundColor: 'white', height: '50%'}} >
                                        <Paper style={{backgroundColor: "#ACDCFF"}}>
                                            <Typography alignItems="center" variant="h4">Listeners</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} style={{backgroundColor: 'white', height: '50%'}} >
                                        <Paper style={{backgroundColor: "#ACDCFF"}}>
                                            <Typography alignItems="center" variant="h4">Chat</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={this.state.currentTab} index={1}>

                        </TabPanel>
                    </Grid>
                </Grid>
        )
    }
}

export default ListeningRoomPage;
