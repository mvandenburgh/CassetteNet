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
    Tabs,
    Tab,
    Typography,
} from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircleOutline as InviteUserIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import Mixtape from '../Mixtape';
import UserSearchBar from '../UserSearchBar';
import CurrentSongContext from '../../contexts/CurrentSongContext';
import UserContext from '../../contexts/UserContext';
import { getMixtape, getListeningRoom, getUserProfilePictureUrl, sendListeningRoomInvitation, SERVER_ROOT_URL } from '../../utils/api';
import socketIOClient from 'socket.io-client';
import logo from '../../images/logo.png';
import '../styles/chatbox.css';
import { ChatBox } from 'react-chatbox-component';


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

    const history = useHistory();

    const { setCurrentSong } = useContext(CurrentSongContext);

    const { user } = useContext(UserContext);

    const [listeningRoom, setListeningRoom] = useState(null);
    const [mixtape, setMixtape] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);

    const [socket, setSocket] = useState(socketIOClient(SERVER_ROOT_URL));

    const handleTabChange = (e, val) => setCurrentTab(val);

    const [endSessionPopupOpen, setEndSessionPopupOpen] = useState(false);

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
                socket.on('endListeningRoom', () => {
                    setEndSessionPopupOpen(true);
                    setTimeout(history.goBack, 4000);
                });
            })
            .catch(err => console.log(err));
    }, []);

    const [currentChatText, setCurrentChatText] = useState('');

    const sendChatHandler = (message) => {
        socket.emit('sendChatMessage', { message, timestamp: Date.now(), from: { user: user._id, username: user.username } });
    }

    const [inviteUserPopupOpen, setInviteUserPopupOpen] = useState(false);
    const [userToInvite, setUserToInvite] = useState(null);

    const inviteUser = () => {
        sendListeningRoomInvitation(userToInvite._id, listeningRoom._id, listeningRoom.mixtape);
    }

    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        if (listeningRoom) {
            console.log(logo)
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

    if (!listeningRoom) {
        return null;
    }

    return (
        <div>
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
                                    <Grid container style={{ height: '5%' }} />
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
        </div>
    )
}

export default ListeningRoomPage;
