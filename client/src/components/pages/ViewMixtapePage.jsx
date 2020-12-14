import React, { useContext, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import {
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Toolbar,
    Typography,
} from '@material-ui/core';
import Mixtape from '../Mixtape';
import FavoriteMixtapeButton from '../FavoriteMixtapeButton';
import MixtapeComments from '../MixtapeComments';
import { createListeningRoom, forkMixtape, getMixtape, getMixtapeCoverImageUrl, updateMixtape, getSongDuration } from '../../utils/api';
import JSTPSContext from '../../contexts/JSTPSContext';
import { ChangeMixtapeName_Transaction } from '../transactions/ChangeMixtapeName_Transaction';
import { Redo as RedoIcon, Delete as DeleteIcon, Save as SaveIcon, Add as AddIcon, MusicNote as MusicNoteIcon, Settings as SettingsIcon, Comment as CommentIcon, Share as ShareIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon, Undo as UndoIcon, FileCopy as FileCopyIcon, Close as CloseIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import MixtapeCoverImageUploadModal from '../modals/MixtapeCoverImageUploadModal';
import ShareMixtapeModal from '../modals/ShareMixtapeModal';
import UserContext from '../../contexts/UserContext';
import CurrentSongContext from '../../contexts/CurrentSongContext';
import humanizeDuration from 'humanize-duration';
import { DeleteSong_Transaction } from '../transactions/DeleteSong_Transaction';
import { AddSong_Transaction } from '../transactions/AddSong_Transaction';
import SettingsModal from '../modals/SettingsModal';
import PlayingSongContext from '../../contexts/PlayingSongContext';
import { useEventListener } from '../../hooks';
import SongSearchModal from '../modals/SongSearchModal';

const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}


function ViewMixtapePage(props) {
    const history = useHistory();
    const goBack = () => history.goBack();

    const [mixtape, setMixtape] = useState(null);
    const [editMixtapeNameField, setEditMixtapeNameField] = useState('');

    const { tps } = useContext(JSTPSContext);

    const undoRedoKeyboardHandler = (e) => {
        if (e.repeat) { // only count held down keys as one key press
            return;
        } else if (e.ctrlKey && e.code === 'KeyZ') {
            undoHandler();
        } else if (e.ctrlKey && e.code === 'KeyY') {
            redoHandler();
        }
    }

    useEventListener('keypress', undoRedoKeyboardHandler);

    const { setPlaying } = useContext(PlayingSongContext);

    const owner = mixtape?.collaborators.filter(c => c?.permissions === 'owner').map(c => c?.username)[0];

    const [isEditing, setIsEditing] = useState(false);
    const [editButtonVisible, setEditButtonVisible] = useState(false);

    const [uploadCoverImagePopup, setUploadCoverImagePopup] = useState(false);
    const [coverImageUrl, setCoverImageUrl] = useState(null);

    const [shareMixtapePopupIsOpen, setShareMixtapePopupIsOpen] = useState(false);

    const [songsToDelete, setSongsToDelete] = useState([]);
    const [addSongPopupIsOpen, setAddSongPopupIsOpen] = useState(false); // whether add song popup is open
    const [songToAdd, setSongToAdd] = useState({});
    const [settingsPopupIsOpen, setSettingsPopupIsOpen] = useState(false);
    const [songSearchOpen, setSongSearchOpen] = useState(true);

    const { currentSong, setCurrentSong } = useContext(CurrentSongContext);
    const { user } = useContext(UserContext);

    const [apiToUse, setApiToUse] = useState('soundcloud');

    // add array of songs to current mixtape
    const addSongs = async (songs) => {
        // if (mixtape.songs.map(s => s.id).includes(song.id)) return;
        const newSongs = [...mixtape.songs];
        for (const song of songs) {
            console.log(song)
            if (!song.duration) {
                const duration = await getSongDuration(song.type, song.id);
                song.duration = duration;
            }
            newSongs.push(song);
            const addSongTransaction = new AddSong_Transaction(mixtape.songs, newSongs, mixtape);
            tps.addTransaction(addSongTransaction);
        }
        
        mixtape.songs = newSongs;
        setMixtape(mixtape);
        setSongToAdd({});
    }

    const deleteSongs = () => {
        const deleteSongTransaction = new DeleteSong_Transaction(mixtape.songs, songsToDelete, mixtape);
        tps.addTransaction(deleteSongTransaction);
        setMixtape(mixtape);
        setSongsToDelete([]);
    }

    // watch for changes to mixtape and update server accordingly
    const prevMixtape = usePrevious(mixtape);
    useEffect(async () => {
        if (
            !_.isEqual(
                prevMixtape,
                mixtape,
            )
        ) {
            getMixtape(props.match.params.id).then((updatedMixtape) => {
                if (updatedMixtape.songs.length > 0) {
                    updatedMixtape.duration = updatedMixtape.songs.map(song => song.duration).reduce((mixtapeDuration, songDuration) => mixtapeDuration + songDuration);
                } else {
                    updatedMixtape.duration = 0;
                }
                setMixtape(updatedMixtape);
                setCoverImageUrl(getMixtapeCoverImageUrl(updatedMixtape._id));
                setEditMixtapeNameField(updatedMixtape.name);
            });
        }
    }, [mixtape, prevMixtape]);

    // fetch mixtape from server
    useEffect(async () => {
        const initialMixtape = await getMixtape(props.match.params.id);
        if (!initialMixtape) {
            history.push('/');
            return;
        }
        const durations = initialMixtape.songs.map(song => song.duration);
        if (durations.length > 0) {
            initialMixtape.duration = durations.reduce((total, current) => total + current);
        } else {
            initialMixtape.duration = 0;
        }
        setMixtape(initialMixtape);
        setCoverImageUrl(getMixtapeCoverImageUrl(initialMixtape._id));
    }, []);


    // hide edit button if user is a viewer or non-collaborator
    useEffect(() => {
        if (mixtape?.collaborators) {
            for (const collaborator of mixtape.collaborators) {
                if (collaborator.user === user._id) {
                    if (collaborator.permissions === 'editor' || collaborator.permissions === 'owner') {
                        setEditButtonVisible(true);
                    } else {
                        setEditButtonVisible(false);
                    }
                    break;
                }
            }
        }
    });

    const enableEditingHandler = () => {
        setIsEditing(true);
        setCurrentSong({
            mixtape: currentSong?.mixtape,
            index: currentSong?.index,
            disabled: mixtape?._id,
        });
        setPlaying(false);
    }

    const handleChangeName = (e) => {
        console.log("Text field value:" + e.target.value);
        const changeMixtapeNameTransaction = new ChangeMixtapeName_Transaction(editMixtapeNameField, e.target.value, mixtape);
        tps.addTransaction(changeMixtapeNameTransaction);
        setEditMixtapeNameField(e.target.value);
    }

    const saveMixtape = async () => {
        setIsEditing(false)
        mixtape.name = editMixtapeNameField;
        setMixtape(mixtape);
        updateMixtape(mixtape);
        const newCurrentSong = { ...currentSong };
        newCurrentSong.disabled = null;
        setCurrentSong(newCurrentSong);
    }

    const undoDeleteSong = () => {
        console.log("Undo Delete Song");
        tps.undoTransaction();
        setMixtape(mixtape);
        setSongsToDelete([]);
    }

    const undoAddSong = () => {
        console.log("Undo Add Song");
        tps.undoTransaction();
        setMixtape(mixtape);
        setSongToAdd({});
        /////////////////
        setCurrentSong({
            mixtape: currentSong.mixtape,
            index: currentSong.index,
            disabled: null,
        });
    }


    const undoChangeSongPosition = () => {
        console.log("Undo Change Song Position");
        tps.undoTransaction();
        setMixtape(mixtape);
        setCurrentSong({
            mixtape: currentSong.mixtape,
            index: currentSong.index,
            disabled: null,
        });
    }

    const undoChangeMixtapeName = () => {
        console.log("Undo Change Mixtape Name");
        tps.undoTransaction();
        setMixtape(mixtape);
        setEditMixtapeNameField(mixtape.name)
    }

    const undoHandler = () => {
        if (tps.getSize() > 0 && isEditing) {
            const { transactionType } = tps.transactions[tps.getSize() - 1];
            console.log("Top of transaction stack: " + transactionType);
            switch (transactionType) {
                case "ChangeMixtapeName_Transaction":
                    undoChangeMixtapeName();
                    break;
                case "DeleteSong_Transaction":
                    undoDeleteSong();
                    break;
                case "AddSong_Transaction":
                    undoAddSong();
                    break;
                case "SongPosition_Transaction":
                    undoChangeSongPosition();
                    break;
                default:
                    console.log("Unknown transaction.");
            }
        }
    }

    const redoDeleteSong = () => {
        console.log("Redo Delete Song");
        tps.doTransaction();
        setMixtape(mixtape);
        setSongsToDelete([]);
        setCurrentSong({
            mixtape: currentSong.mixtape,
            index: currentSong.index,
            disabled: null,
        });
    }

    const redoAddSong = () => {
        console.log("Redo Add Song");
        tps.doTransaction();
        setMixtape(mixtape);
        setCurrentSong({
            mixtape: currentSong.mixtape,
            index: currentSong.index,
            disabled: null,
        });
    }

    const redoChangeSongPosition = () => {
        console.log("Redo Change Song Position");
        tps.doTransaction();
        setMixtape(mixtape);
        setCurrentSong({
            mixtape: currentSong.mixtape,
            index: currentSong.index,
            disabled: null,
        });
    }

    const redoChangeMixtapeName = () => {
        console.log("Redo Change Mixtape Name");
        tps.doTransaction();
        setMixtape(mixtape);
        setEditMixtapeNameField(mixtape.name);
    }

    const redoHandler = () => {
        if (tps.getSize() > 0 && isEditing) {
            const { transactionType } = tps.transactions[tps.getSize() - 1];
            console.log("Top of transaction stack: " + transactionType);
            switch (transactionType) {
                case "ChangeMixtapeName_Transaction":
                    redoChangeMixtapeName();
                    break;
                case "DeleteSong_Transaction":
                    redoDeleteSong();
                    break;
                case "AddSong_Transaction":
                    redoAddSong();
                    break;
                case "SongPosition_Transaction":
                    redoChangeSongPosition();
                    break;
                default:
                    console.log("Unknown transaction.");
            }
        }
    }

    const createListeningRoomButtonHandler = () => {
        if (mixtape) {
            setCurrentSong({});
            createListeningRoom(mixtape._id)
                .then(listeningRoomId => history.push(`/listeningRoom/${listeningRoomId}`))
                .catch(err => alert(err));
        }
    }

    const forkThisMixtape = () => {
        forkMixtape(mixtape, user).then(newMixtape => history.push(`/mixtape/${newMixtape.data._id}`));
    }

    const [open, setOpen] = useState(false);

    const handleClick = async (mixtape) => {
        setOpen(true);
        forkThisMixtape(mixtape);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const [mixtapeToShare, setMixtapeToShare] = useState(null);

    const [shareModalOpen, setShareModalOpen] = useState(false);

    const shareMixtapeHandler = (mixtape) => {
        console.log(mixtape);
        setMixtapeToShare(mixtape);
        setShareModalOpen(true);
    }


    return (
        <div>
            <SongSearchModal open={addSongPopupIsOpen} setOpen={setAddSongPopupIsOpen} addSongs={addSongs} mixtape={mixtape} />
            <SettingsModal
                mixtape={mixtape}
                setMixtape={setMixtape}
                user={user}
                settingsPopupIsOpen={settingsPopupIsOpen}
                handleSettingsPopup={() => setSettingsPopupIsOpen(!settingsPopupIsOpen)}
            />

            <ShareMixtapeModal
                mixtape={mixtape}
                open={shareModalOpen}
                setOpen={setShareModalOpen}
            />

            <MixtapeCoverImageUploadModal coverImageUrl={coverImageUrl} setCoverImageUrl={setCoverImageUrl} mixtape={mixtape} setMixtape={setMixtape} open={uploadCoverImagePopup} setOpen={setUploadCoverImagePopup} />

            {/* <Dialog open={false} onClose={() => setAddSongPopupIsOpen(false)}>
                <DialogTitle id="form-dialog-title">Add a Song!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Type the song you want to add:
                    </DialogContentText>
                    <Grid container>
                        <Grid item xs={8}>
                            <SongSearchBar apiToUse={apiToUse} setSelected={setSongToAdd} toExclude={mixtape?.songs.map(s => s.id)} />
                        </Grid>
                        <Grid item xs={2} />
                        <Grid item xs={2}>
                            <Select value={apiToUse} onChange={(e) => setApiToUse(e.target.value)}>
                                <MenuItem value={'soundcloud'}>SoundCloud</MenuItem>
                                <MenuItem value={'youtube'}>YouTube</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button align="center" onClick={throttle(addSong, 1000)} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog> */}


            <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
                <ArrowBackIcon />
            </IconButton>

            <Paper style={{ height: '10em', padding: '1%', marginLeft: '5%', marginBottom: '2%', width: '70%' }}>
                {/* {isEditing ? <TextField value={mixtape.name} /> : <h1>{mixtape.name || 'Mixtape Title'}</h1>} */}
                <Grid style={{ height: '100%', width: '100%' }} container>
                    <Grid style={{ height: '100%', width: '100%' }} xs={1} item>
                        <img onClick={() => isEditing ? setUploadCoverImagePopup(true) : undefined} style={{ cursor: isEditing ? 'pointer' : '', width: '80%', height: '100%', objectFit: 'contain' }} src={coverImageUrl ? coverImageUrl : ''} />
                    </Grid>
                    <Grid xs={8} item>
                        {
                            isEditing
                                ? <TextField onChange={handleChangeName} value={editMixtapeNameField} />
                                : <Typography variant="h4">{mixtape?.name}</Typography>
                        }

                        <br />
                        <Typography variant="h6" style={{ display: 'inline-block' }}>{`Created by ${owner} ${mixtape?.songs.length} songs, ${humanizeDuration(mixtape?.duration * 1000, { round: true }).replaceAll(',', '')}`}</Typography>
                    </Grid>
                    <Grid xs={3} item>
                        {
                            user.isLoggedIn ?
                                <Box style={{ display: 'inline-flex', flexDirection: 'row', float: 'right' }}>
                                    <FavoriteMixtapeButton id={props.match.params.id} style={{ margin: '10px' }} />
                                    {/* <CommentIcon onClick={() => setWriteMessageDialogOpen(true)} style={{ margin: '10px', cursor: 'pointer' }} /> */}
                                    <ShareIcon style={{ margin: '10px' }} onClick={() => shareMixtapeHandler(mixtape)} />
                                </Box>
                                : undefined
                        }
                    </Grid>
                </Grid>

            </Paper>
            <Grid container direction="column" justify="center" alignItems="center">
                <Grid item xs={12} style={{ width: '90%' }}>
                    <Toolbar style={{ backgroundColor: 'black', display: isEditing ? '' : '' }}>
                        {isEditing ?
                            <Grid container>
                                <Grid item xs={1}>
                                    <Button
                                        startIcon={<SaveIcon />}
                                        style={{ marginRight: '5%', float: 'right' }}
                                        onClick={() => saveMixtape(mixtape)}
                                        variant="contained"
                                    >DONE</Button>
                                </Grid>
                                <Grid item xs={5} />
                                <Grid item xs={2}>
                                    <Button
                                        style={{ marginRight: '5%', float: 'right', backgroundColor: 'green' }}
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<SettingsIcon />}
                                        onClick={() => setSettingsPopupIsOpen(!settingsPopupIsOpen)}
                                    >
                                        Settings
                                    </Button>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        onClick={() => setAddSongPopupIsOpen(!addSongPopupIsOpen)}
                                        style={{ marginRight: '5%', float: 'right' }}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                    >
                                        Add a Song
                                     </Button>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        style={{ display: songsToDelete.length > 0 ? '' : 'none', marginRight: '5%', float: 'right' }}
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => deleteSongs()}
                                    >
                                        Delete
                                    </Button>
                                </Grid>
                            </Grid>
                            :
                            user?.isLoggedIn ?
                                <Grid container>
                                    <Grid item xs={4}>
                                        <Button
                                            style={{ marginRight: '5%', float: 'left', backgroundColor: 'steelblue' }}
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<MusicNoteIcon />}
                                            onClick={createListeningRoomButtonHandler}
                                        >
                                            Create Listening Room
                                        </Button>
                                    </Grid>
                                    <Grid item xs={2} />
                                    <Grid item xs={2}>
                                        <Button
                                            style={{ marginRight: '5%', float: 'right', backgroundColor: 'green' }}
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<SettingsIcon />}
                                            onClick={() => setSettingsPopupIsOpen(!settingsPopupIsOpen)}
                                        >
                                            Settings
                                        </Button>
                                    </Grid>
                                    <Grid item xs={2} >
                                        <Button
                                            style={{ marginRight: '5%', float: 'right', backgroundColor: 'purple' }}
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<FileCopyIcon />}
                                            onClick={() => handleClick(mixtape)}
                                        >
                                            Copy
                                            </Button>
                                        <Snackbar
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            open={open}
                                            autoHideDuration={4000}
                                            onClose={handleClose}
                                            message="Copied to your mixtapes"
                                            action={
                                                <React.Fragment>
                                                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </React.Fragment>
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        {
                                            !isEditing && editButtonVisible ?
                                                <Button
                                                    startIcon={<EditIcon />}
                                                    onClick={enableEditingHandler}
                                                    style={{ position: 'absolute', right: '5%' }}
                                                    variant="contained">
                                                    EDIT
                                                </Button>
                                                : undefined
                                        }
                                    </Grid>
                                </Grid>
                                : undefined
                        }
                    </Toolbar>
                </Grid>
                <Grid item xs={12} style={{ width: '90%' }}>
                    <Mixtape
                        enableEditing={true}
                        isEditing={isEditing}
                        songsToDelete={songsToDelete}
                        setSongsToDelete={setSongsToDelete}
                        setIsEditing={setIsEditing}
                        mixtape={mixtape}
                        setMixtape={setMixtape}
                        listeningRoom={false}
                    />
                </Grid>
                <Grid item xs={12} style={{ width: '90%' }}>
                    <MixtapeComments mixtape={mixtape} setMixtape={setMixtape} />
                </Grid>
            </Grid>
            <div style={{ display: isEditing ? '' : 'none' }}>
                <Fab color="secondary" style={{ position: 'fixed', bottom: '15%', right: '10%', }} onClick={() => redoHandler()}>
                    <RedoIcon />
                </Fab>
                <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: '15%', right: '20%', }} onClick={() => undoHandler()}>
                    <UndoIcon />
                </Fab>
            </div>
        </div>
    )
}

export default ViewMixtapePage;
