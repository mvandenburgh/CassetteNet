import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    AppBar,
    Backdrop,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Fade,
    Grid,
    Modal,
    Paper,
    Snackbar,
    Tabs,
    Tab,
    Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles,ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { AddCircleOutline as InviteUserIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import Mixtape from '../Mixtape';
import UserSearchBar from '../UserSearchBar';
import CurrentSongContext from '../../contexts/CurrentSongContext';
import PlayingSongContext from '../../contexts/PlayingSongContext';
import UserContext from '../../contexts/UserContext';
import SocketIOContext from '../../contexts/SocketIOContext';
import { getListeningRoom, getUserProfilePictureUrl, sendListeningRoomInvitation, getGameScores } from '../../utils/api';
import logo from '../../images/logo.png';
import '../styles/chatbox.css';
import { ChatBox } from 'react-chatbox-component';
import RhythmGame from '../listeningroom/RhythmGame';
import SnakeGame from '../Snake/SnakeGame';
import ListeningRoomPlayer from '../listeningroom/ListeningRoomPlayer';
import { useInterval, useEventListener } from '../../hooks';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import snakeIcon from '../../images/snakeIcon.png';

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
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function ListeningRoomPage(props) {
    const classes = useStyles();

    const { setCurrentSong } = useContext(CurrentSongContext);

    const { setPlaying } = useContext(PlayingSongContext);

    const history = useHistory();

    useEffect(() => {
        const unlisten = history.listen(location => {
            setCurrentSong({ listeningRoom: true });
            window.location.reload();
        });
        return unlisten;
    }, []);

    const theme = createMuiTheme({
        palette: {
          primary: {
            main:'#FFFFFF',
          },
        },
      });

    const { user } = useContext(UserContext);

    const [listeningRoom, setListeningRoom] = useState(null);
    const [mixtape, setMixtape] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [songStarted, setSongStarted] = useState(false);

    const { socket } = useContext(SocketIOContext);

    const handleTabChange = (e, val) => setCurrentTab(val);

    const [endSessionPopupOpen, setEndSessionPopupOpen] = useState(false);

    const [queuedUpForRhythmGame, setQueuedUpForRhythmGame] = useState(false);
    const queuedUpForRhythmGameRef = useRef();
    useEffect(() => queuedUpForRhythmGameRef.current = queuedUpForRhythmGame, [queuedUpForRhythmGame]);

    // show alerts for queueing/dequeing from rhythm game
    const [showQueueSuccessMessage, setShowQueueSuccessMessage] = useState(false);
    const [showDequeueSuccessMessage, setShowDequeueSuccessMessage] = useState(false);

    const [scores, setScores] = useState([]);

    // const [gameOver, setGameOver] = useState(false);

    useInterval(() => {
        if (screen !== 'home') {
            getGameScores(listeningRoom._id, screen).then(newScores => setScores(newScores));
        }
    }, 500);
    const lrRef = useRef(listeningRoom);

    useEffect(() => lrRef.current = listeningRoom);

    useEffect(() => {
        setCurrentSong({ listeningRoom: true });
        getListeningRoom(props.match.params.id)
            .then(listeningRoom => {
                setPlaying(true);
                setListeningRoom(listeningRoom);
                setMixtape(listeningRoom.mixtape);
                socket.emit('joinListeningRoom', { user, listeningRoom });
                socket.on('userJoinedOrLeft', () => {
                    getListeningRoom(props.match.params.id)
                        .then(lr => {
                            setListeningRoom(lr);
                            setMixtape(lr.mixtape);
                        });
                });
                socket.on('newChatMessage', newChatMessages => {
                    const newListeningRoom = { ...lrRef.current };
                    newListeningRoom.chatMessages = newChatMessages;
                    setListeningRoom(newListeningRoom);
                });
                socket.on('changeSong', ({snakeScores, rhythmScores}) => {
                    // setGameOver(true);
                    // TODO: have popup here showing final scores and winner
                    console.log(snakeScores)
                    setScores([]);
                    // setScreen('home');
                    getListeningRoom(props.match.params.id).then(lr => {
                        setListeningRoom(lr);
                        setPlaying(true);
                    });
                });
                socket.on('endListeningRoom', () => {
                    setEndSessionPopupOpen(true);
                    setTimeout(history.goBack, 4000);
                });
                socket.on('rhythmGameAboutToBegin', () => {
                    if (queuedUpForRhythmGameRef.current) {
                        setPlaying(false);
                        getListeningRoom(props.match.params.id).then(lr => {
                            setListeningRoom(lr);
                        });
                        setCurrentTab(1); // TODO: prompt user that game is about to start before changing tabs
                        setScreen('rhythm');
                    }
                });
            })
            .catch(err => history.goBack());
    }, []);

    const sendChatHandler = (message) => {
        socket.emit('sendChatMessage', { message, timestamp: Date.now(), from: { user: user._id, username: user.username } });
    }
    const exitGameHandler = () => {
        setScreen('home');
    }

    const [inviteUserPopupOpen, setInviteUserPopupOpen] = useState(false);
    const [userToInvite, setUserToInvite] = useState(null);

    const inviteUser = () => {
        sendListeningRoomInvitation(userToInvite._id, listeningRoom._id, listeningRoom.mixtape);
    }

    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        if (listeningRoom) {
            const newChatMessages = listeningRoom.chatMessages.map((message, i) => ({
                text: message.message,
                id: i,
                sender: {
                    name: message?.from?.username,
                    uid: message?.from?.user ? message.from.user : '#chatbot',
                    avatar: message?.from?.user ? getUserProfilePictureUrl(message.from.user) : logo,
                },
            }));
            setChatMessages(newChatMessages);
        }
    }, [listeningRoom]);

    const [screen, setScreen] = useState('home'); // can be one of ['home', 'snake', 'rhythm']

    useEffect(() => {
        if (screen !== 'home') {
            getGameScores(listeningRoom._id, screen).then(newScores => {
                setScores(newScores);
            });
        }
    }, [screen]);

    const gameScreenRef = useRef();

    const [gameScreenStartX, setGameScreenStartX] = useState(null);
    const [gameScreenEndX, setGameScreenEndX] = useState(null);
    const [gameScreenStartY, setGameScreenStartY] = useState(null);
    const [gameScreenEndY, setGameScreenEndY] = useState(null);
    const [gameScreenHeight, setGameScreenHeight] = useState(null);
    const [gameScreenWidth, setGameScreenWidth] = useState(null);

    useEffect(() => {
        if (gameScreenRef?.current) {
            const { offsetLeft, offsetTop, clientHeight, clientWidth } = gameScreenRef.current;
            setGameScreenStartX(offsetLeft);
            setGameScreenEndX(offsetLeft + clientWidth);
            setGameScreenStartY(offsetTop);
            setGameScreenEndY(offsetTop + clientHeight);
            setGameScreenHeight(gameScreenRef.current.clientHeight);
            setGameScreenWidth(gameScreenRef.current.clientWidth);
        }
    });

    const rhythmGameHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!queuedUpForRhythmGame) {
            setQueuedUpForRhythmGame(true);
            setShowQueueSuccessMessage(true);
            setShowDequeueSuccessMessage(false);
            socket.emit('queueRhythmGame');
            
        } else {
            setQueuedUpForRhythmGame(false);
            setShowDequeueSuccessMessage(true);
            setShowQueueSuccessMessage(false);
            socket.emit('dequeueRhythmGame');
        }
        
        
    }
    const snakeGameHandler = () => {
        setScreen('snake');
    }

    const changeListeningRoomSong = (index) => {
        if (user._id === listeningRoom?.owner.user) {
            setPlaying(false);
            socket.emit('changeSong', index);
        }
    }

    useEventListener('keypress', e => {
        if (e.ctrlKey && e.code === 'Delete') {
            e.preventDefault();
            if (queuedUpForRhythmGame) {
                socket.emit('dequeueRhythmGame');
                setQueuedUpForRhythmGame(false);
                setShowQueueSuccessMessage(false);
                setShowDequeueSuccessMessage(true);
                setScreen('home');
            }
        }
    });

    if (!listeningRoom) {
        return null;
    }

    return (
        <div>
            <Grid container justify="center">
                <Grid item style={{ width: '90%' }}>
                    <AppBar position="static">
                        <Tabs value={currentTab} onChange={handleTabChange} centered={true} variant="fullWidth">
                            <Tab label="Listen" {...a11yProps(0)} />
                            <Tab label="Game" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                </Grid>
                <Grid item style={{ width: '90%', backgroundColor: '#30A9ED' }}>
                    <TabPanel value={currentTab} index={0}>
                        <Grid style={{ height: '70vh' }} container>
                            <Grid item xs={8}>
                                <Paper style={{ marginBottom: '2%' }}>
                                    <Typography>
                                        <h1>{`${listeningRoom?.owner.username}'s Listening Room`}</h1>
                                    </Typography>
                                    <Typography variant="h5">~Listening to {mixtape?.name}~</Typography>
                                </Paper>
                                <Mixtape mixtape={mixtape} enableEditing={false} listeningRoom={true} changeListeningRoomSong={changeListeningRoomSong} />
                            </Grid>
                            <Grid item xs={1} />
                            <Grid item xs={3} style={{ backgroundColor: '#ACDCFF', height: '100%' }}>
                                <Paper style={{ margin: '2%', backgroundColor: "white", height: '28%' }}>
                                    <Grid container alignItems="center" direction="row" style={{ height: '10%' }}>
                                        <Grid item xs={10}>
                                            <Typography style={{ fontSize: '2em' }} alignItems="center">Listeners</Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <InviteUserIcon style={{ cursor: 'pointer' }} onClick={() => setInviteUserPopupOpen(true)} />
                                        </Grid>
                                        <Grid item xs={1} />
                                    </Grid>
                                    <br />
                                    <Grid direction="row" container style={{ height: 'calc(95% - 2em)', overflow: 'auto' }}>
                                        <Grid container>
                                            <Grid item xs={12} style={{}}>
                                                {listeningRoom?.currentListeners.map(u => <Typography>{u.username}</Typography>)}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                                <Paper style={{ margin: '2%', backgroundColor: "white", height: '68%' }}>
                                    <Grid container style={{ height: '10%' }}>
                                        <Typography style={{ fontSize: '2em' }} alignItems="center">Chat</Typography>
                                    </Grid>
                                    <Grid container style={{ height: '5%' }} />
                                    <Grid direction="row" container style={{ height: 'calc(95% - 2em)', overflow: 'auto' }}>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <ChatBox
                                                    messages={chatMessages}
                                                    onSubmit={sendChatHandler}
                                                    isLoading={chatMessages?.length === 0}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        <Grid style={{ height: '80vh' }} container>
                            <Grid style={{}} container xs={9}>
                                {/* <Grid style={{ backgroundColor: 'red' }} item xs={12}>
                                    <Typography variant="h7">Invite</Typography>
                                </Grid> */}
                                <Grid style={{ height: '75vh' }} item xs={12}>
                                    <Grid container style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                        <Paper onKeyDown={e => {      
                                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                return false;
                                            }
                                            e.stopPropagation();
                                        }}
                                            ref={gameScreenRef} style={{ height: '90%', width: '95%', backgroundColor: '#6FE5FF' }}>
                                            {screen === 'snake' ? <Button style={{ alignItems: 'right', position: 'absolute', zIndex: 1}} onClick={exitGameHandler}> Exit Game </Button> : undefined}
                                            {screen === 'rhythm' ?
                                                <RhythmGame scores={scores} setScores={setScores} songStarted={songStarted} gameScreenStartX={gameScreenStartX} gameScreenEndX={gameScreenEndX} gameScreenStartY={gameScreenStartY} gameScreenEndY={gameScreenEndY} gameScreenHeight={gameScreenHeight} gameScreenWidth={gameScreenWidth} listeningRoom={listeningRoom} />
                                                : screen === 'snake' ?
                                                    <SnakeGame gameScreenStartX={gameScreenStartX} gameScreenEndX={gameScreenEndX} gameScreenStartY={gameScreenStartY} gameScreenEndY={gameScreenEndY} gameScreenHeight={gameScreenHeight} gameScreenWidth={gameScreenWidth} listeningRoom={listeningRoom} scores={scores} setScores={setScores} /> : <Grid container style={{ height: '90%', display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
                                                        <Grid item xs={2} />
                                                        <Grid item xs={10}>
                                                            <Paper variant="outlined" style={{ background: '#305B8D', color: 'white', height: '70%', width: '80%' }}>
                                                                <Typography align="center" variant="h4">Select the game you want to play:</Typography>
                                                            </Paper>
                                                            <Grid item xs={2} />
                                                        </Grid>
                                                        <Grid container style={{ height: '30%' }}>
                                                            <Grid item xs={3} />
                                                            <Grid style={{ backgroundColor: 'yellow', cursor: 'pointer' }} item xs={2} onClick={rhythmGameHandler}>
                                                                <MusicVideoIcon  style={{fontSize: 150, alignItems: 'center'}}/>
                                                                <Typography align="center" variant="h5">Rhythm Game</Typography>
                                                                </Grid>
                                                            <Grid item xs={2} />
                                                            <Grid style={{ backgroundColor: 'black', cursor: 'pointer' }} item xs={2} onClick={snakeGameHandler}>
                                                            <img align="center" src={snakeIcon} alt='logo' />
                                                            <ThemeProvider theme={theme}>

                                                            <Typography align="center" color="primary" variant="h5">Snake Game</Typography>
                                                            </ThemeProvider>
                                                                </Grid>
                                                            <Grid item xs={3} />
                                                        </Grid>
                                                        {/* <Grid container style={{ height: '20%', backgroundColor: 'yellow' }}>
                                                            <Grid style={{ backgroundColor: 'pink' }} item xs={4} />
                                                            <Grid item xs={4}>
                                                                <Button style={{ height: '100%', width: '100%' }} variant="contained">Start Game</Button>
                                                            </Grid>
                                                            <Grid style={{ backgroundColor: 'orange' }} item xs={4} />
                                                        </Grid> */}
                                                    </Grid>
                                            }
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={3} style={{ backgroundColor: '#ACDCFF', height: '100%' }}>
                                {screen === 'rhythm' ?
                                <Paper style={{ margin: '2%', backgroundColor: "white", height: '48%' }}>
                                    <Grid container alignItems="center" direction="row" style={{ height: '10%' }}>
                                        <Grid item xs={12}>
                                            <Typography style={{ fontSize: '2em' }} alignItems="center">Scores</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ height: '5%' }} />
                                    <Grid direction="row" container style={{ height: 'calc(95% - 2em)', overflow: 'auto' }}>
                                        <Grid container>
                                            <Grid item xs={12} style={{}}>
                                                {scores ? scores?.map(score => (
                                                    <div> {score.username}: {score.score} </div>
                                                )) : undefined}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                                : undefined}
                                <Paper style={{ margin: '2%', backgroundColor: "white", height: screen === 'rhythm' ? '48%' : '95%' }}>
                                    <Grid container style={{ height: '10%' }}>
                                        <Typography style={{ fontSize: '2em' }} alignItems="center">Chat</Typography>
                                    </Grid>
                                    <Grid container style={{ height: '5%' }} />
                                    <Grid direction="row" container style={{ height: 'calc(95% - 2em)', overflow: 'auto' }}>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <ChatBox
                                                    messages={chatMessages}
                                                    onSubmit={sendChatHandler}
                                                    isLoading={chatMessages?.length === 0}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </TabPanel>
                </Grid>
            </Grid>
            <ListeningRoomPlayer setSongStarted={setSongStarted} listeningRoom={listeningRoom} setListeningRoom={setListeningRoom} rhythmGame={queuedUpForRhythmGame} />
            <Dialog open={inviteUserPopupOpen} onClose={() => setInviteUserPopupOpen(false)}>
                <DialogTitle>Invite a User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the username of the user you wish to invite
                    </DialogContentText>
                    <UserSearchBar userSelectHandler={setUserToInvite} />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={inviteUser}>Invite</Button>
                </DialogActions>
            </Dialog>
            <Modal
                className={classes.modal}
                open={endSessionPopupOpen}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={endSessionPopupOpen}>
                    <Grid container direction="row" justify="center" alignItems="center" style={{ backgroundColor: blueGrey[200], height: '15%', width: '30%' }}>
                        <span>The host has left the listening room. Ending session...</span>
                    </Grid>
                </Fade>
            </Modal>
            <Snackbar
                open={showDequeueSuccessMessage}
                autoHideDuration={5000}
                onClose={() => setShowDequeueSuccessMessage(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Alert severity="info">Successfully dequeued from the rhythm game.</Alert>
            </Snackbar>
            <Snackbar
                open={showQueueSuccessMessage}
                autoHideDuration={5000}
                onClose={() => setShowQueueSuccessMessage(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Alert severity="info">Successfully queued up for the next rhythm game.</Alert>
            </Snackbar>
        </div>
    )
}

export default ListeningRoomPage;
