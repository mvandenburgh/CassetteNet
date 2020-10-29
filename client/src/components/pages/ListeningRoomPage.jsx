import React, { Component } from 'react';
import { AppBar, Box, Grid, Paper, Tabs, Tab, Typography, TextField, Button } from '@material-ui/core';
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
        currentTab: 0,
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
                    <Grid item style={{width: '80%', backgroundColor: '#30A9ED'}}>
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
                            <Grid style={{height: '50%'}} container>
                                <Grid style={{}} container xs={9}>
                                    <Grid style={{ backgroundColor: 'red'}} item xs={12}>
                                        <Typography variant="h7">Invite</Typography>
                                    </Grid>
                                    {/* TODO: remove backgroundColors. just there for now to help with development */}
                                    <Grid style={{height: '75vh'}} item xs={12}>
                                        <Grid container style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                            <Paper style={{ height: '90%', width: '95%', backgroundColor: '#6FE5FF'}}>
                                                <Grid container style={{height: '90%', display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
                                                    <Grid item xs={2} />
                                                    <Grid item xs={10}>
                                                        <Paper variant="outlined" style={{background: '#305B8D', color: 'white', height: '70%', width: '80%'}}>
                                                            <Typography variant="h5">Select the game you want to play:</Typography>
                                                        </Paper>
                                                    <Grid item xs={2} />
                                                    </Grid>
                                                    <Grid container style={{height: '30%'}}>
                                                        <Grid item xs={3} />
                                                        <Grid style={{backgroundColor: 'yellow'}} item xs={2}>
                                                            Rhythm Game
                                                        </Grid>
                                                        <Grid item xs={2} />
                                                        <Grid style={{backgroundColor: 'green'}} item xs={2}>
                                                            Snake Game
                                                        </Grid>
                                                        <Grid item xs={3} />
                                                    </Grid>
                                                    <Grid container style={{height: '20%', backgroundColor: 'yellow'}}>
                                                        <Grid style={{backgroundColor: 'pink'}} item xs={4} />
                                                        <Grid item xs={4}>
                                                            <Button style={{height: '100%', width: '100%'}} variant="contained">Start Game</Button>
                                                        </Grid>
                                                        <Grid style={{backgroundColor: 'orange'}} item xs={4} />
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container xs={3}>
                                    <Grid item xs={12} style={{backgroundColor: 'white', height: '50%'}} >
                                        <Paper style={{backgroundColor: "#ACDCFF"}}>
                                            <Typography alignItems="center" variant="h4">Scoreboard</Typography>
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
                    </Grid>
                </Grid>
        )
    }
}

export default ListeningRoomPage;
