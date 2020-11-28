import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppBar, Box, Grid, Paper, Tabs, Tab, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Mixtape from '../Mixtape';
import CurrentSongContext from '../../contexts/CurrentSongContext';
import UserContext from '../../contexts/UserContext';
import { getMixtape, getListeningRoom, SERVER_ROOT_URL } from '../../utils/api';
import socketIOClient from 'socket.io-client';
import 'react-chat-elements/dist/main.css';
import { Input, MessageBox } from 'react-chat-elements';


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

function ListeningRoomPage(props) {
    const { setCurrentSong } = useContext(CurrentSongContext);

    const { user } = useContext(UserContext);

    const [listeningRoom, setListeningRoom] = useState(null);
    const [mixtape, setMixtape] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);

    const [socket, setSocket] = useState(socketIOClient(SERVER_ROOT_URL));

    const handleTabChange = (e, val) => setCurrentTab(val);

    const lrRef = useRef(listeningRoom);

    useEffect(() => lrRef.current = listeningRoom);

    useEffect(() => {
        getListeningRoom(props.match.params.id)
            .then(listeningRoom => {
                setListeningRoom(listeningRoom);
                getMixtape(listeningRoom.mixtape).then(mixtape => setMixtape(mixtape));
                socket.emit('joinListeningRoom', { user, listeningRoom });
                socket.on('userJoinedOrLeft', () => {
                    getListeningRoom(props.match.params.id)
                        .then(lr => {
                            setListeningRoom(lr);
                            console.log(lr);
                            getMixtape(lr.mixtape).then(mixtape => setMixtape(mixtape));
                        })
                        .catch(err => alert(err));
                });
                socket.on('newChatMessage', newChatMessages => {
                    const newListeningRoom = { ...lrRef.current };
                    newListeningRoom.chatMessages = newChatMessages;
                    setListeningRoom(newListeningRoom);
                });
            });
    }, []);

    const [currentChatText, setCurrentChatText] = useState('');

    const sendChatHandler = () => {
        socket.emit('sendChatMessage', { message: currentChatText, timestamp: Date.now(), from: user._id });
    }

    return (
        <Grid container justify="center">
            <Grid item style={{ width: '80%' }}>
                <AppBar position="static">
                    <Tabs value={currentTab} onChange={handleTabChange} centered={true} variant="fullWidth">
                        <Tab label="Listen" {...a11yProps(0)} />
                        <Tab label="Game" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
            </Grid>
            <Grid item style={{ width: '80%', backgroundColor: '#30A9ED' }}>
                <TabPanel value={currentTab} index={0}>
                    <Grid style={{ height: '70vh' }} container>
                        <Grid item xs={8}>
                            <Paper style={{ marginBottom: '2%' }}>
                                <Typography>
                                    <h1>{`${listeningRoom?.owner.username}'s Listening Room`}</h1>
                                </Typography>
                                <Typography variant="h5">~Listening to {mixtape?.name}~</Typography>
                            </Paper>
                            <Mixtape mixtape={mixtape} enableEditing={false} />
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={3} style={{ backgroundColor: '#ACDCFF', height: '100%' }}>
                            <Paper style={{ margin: '2%', backgroundColor: "white", height: '48%' }}>
                                <Grid container style={{ height: '10%' }}>
                                    <Typography style={{ fontSize: '2em' }} alignItems="center">Listeners</Typography>
                                </Grid>
                                <Grid container style={{ height: '5%' }} />
                                <Grid direction="row" container style={{ height: 'calc(95% - 2em)', overflow: 'auto' }}>
                                    <Grid container>
                                        <Grid item xs={12} style={{}}>
                                            {listeningRoom?.currentListeners.map(u => <Typography>{u.username}</Typography>)}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                            <Paper style={{ margin: '2%', backgroundColor: "white", height: '48%' }}>
                                <Grid container style={{ height: '10%' }}>
                                    <Typography style={{ fontSize: '2em' }} alignItems="center">Chat</Typography>
                                </Grid>
                                <Grid container style={{ height: '5%' }} />
                                <Grid direction="row" container style={{ height: 'calc(95% - 2em)', overflow: 'auto' }}>
                                    <Grid container>
                                        <Grid item xs={12} style={{}}>
                                            {listeningRoom?.chatMessages.map(message => (
                                                <MessageBox
                                                    position="left"
                                                    type="text"
                                                    text={message.message}
                                                />
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Input
                                    placeholder="Type here..."
                                    onChange={(e) => setCurrentChatText(e.target.value)}
                                    rightButtons={
                                        <Button
                                            color='white'
                                            backgroundColor='black'
                                            variant="contained"
                                            onClick={sendChatHandler}
                                        >Send</Button>
                                    } />
                            </Paper>

                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={currentTab} index={1}>
                    <Grid style={{ height: '50%' }} container>
                        <Grid style={{}} container xs={9}>
                            <Grid style={{ backgroundColor: 'red' }} item xs={12}>
                                <Typography variant="h7">Invite</Typography>
                            </Grid>
                            {/* TODO: remove backgroundColors. just there for now to help with development */}
                            <Grid style={{ height: '75vh' }} item xs={12}>
                                <Grid container style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <Paper style={{ height: '90%', width: '95%', backgroundColor: '#6FE5FF' }}>
                                        <Grid container style={{ height: '90%', display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
                                            <Grid item xs={2} />
                                            <Grid item xs={10}>
                                                <Paper variant="outlined" style={{ background: '#305B8D', color: 'white', height: '70%', width: '80%' }}>
                                                    <Typography variant="h5">Select the game you want to play:</Typography>
                                                </Paper>
                                                <Grid item xs={2} />
                                            </Grid>
                                            <Grid container style={{ height: '30%' }}>
                                                <Grid item xs={3} />
                                                <Grid style={{ backgroundColor: 'yellow' }} item xs={2}>
                                                    Rhythm Game
                                                </Grid>
                                                <Grid item xs={2} />
                                                <Grid style={{ backgroundColor: 'green' }} item xs={2}>
                                                    Snake Game
                                                </Grid>
                                                <Grid item xs={3} />
                                            </Grid>
                                            <Grid container style={{ height: '20%', backgroundColor: 'yellow' }}>
                                                <Grid style={{ backgroundColor: 'pink' }} item xs={4} />
                                                <Grid item xs={4}>
                                                    <Button style={{ height: '100%', width: '100%' }} variant="contained">Start Game</Button>
                                                </Grid>
                                                <Grid style={{ backgroundColor: 'orange' }} item xs={4} />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container xs={3}>
                            <Grid item xs={12} style={{ backgroundColor: 'white', height: '50%' }} >
                                <Paper style={{ backgroundColor: "#ACDCFF" }}>
                                    <Typography alignItems="center" variant="h4">Scoreboard</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} style={{ backgroundColor: 'white', height: '50%' }} >
                                <Paper style={{ backgroundColor: "#ACDCFF" }}>
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

export default ListeningRoomPage;
