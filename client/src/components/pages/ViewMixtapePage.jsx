import React, { useContext, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import {
    Button, 
    Box, 
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, 
    Fab, 
    Grid, 
    IconButton, 
    Paper, 
    TextField, 
    Typography,

 } from '@material-ui/core';
import Mixtape from '../Mixtape';
import FavoriteMixtapeButton from '../FavoriteMixtapeButton';
import { getMixtape, getMixtapeCoverImageUrl, updateMixtape } from '../../utils/api';
import JSTPSContext from '../../contexts/JSTPSContext';
import { ChangeMixtapeName_Transaction } from '../transactions/ChangeMixtapeName_Transaction';
import { Comment as CommentIcon, Share as ShareIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon, Undo as UndoIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import MixtapeCoverImageUploadModal from '../modals/MixtapeCoverImageUploadModal';
import humanizeDuration from 'humanize-duration';

const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}


function ViewMixtapePage(props) {
    const history = useHistory();
    const goBack = () => { history.push('/') }

    const [mixtape, setMixtape] = useState(null);
    const [textFieldValue, setTextFieldValue] = useState('');

    const [permissions, setPermissions] = useState([]);
    const [permissionUserList, setPermissionUserList] = useState([]);
    const { tps, setTps } = useContext(JSTPSContext);

    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        onSave();
        setOpen(false);
    };
    const owner = mixtape?.collaborators.filter(c => c?.permissions === 'owner').map(c => c?.username)[0];

    const [isEditing, setIsEditing] = useState(false);

    const [uploadCoverImagePopup, setUploadCoverImagePopup] = useState(false);
    const [coverImageUrl, setCoverImageUrl] = useState(null);

    const [changeMixtapeNamePopupIsOpen, setChangeMixtapeNamePopupIsOpen] = useState(false); // whether add song popup is open

    const prevMixtape = usePrevious(mixtape);
    useEffect(()=>{
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
                permissions.forEach((permission, i) => {
                    updatedMixtape.collaborators[i].permissions = permission;
                });
                if (!mixtape) {
                    setPermissions(updatedMixtape.collaborators.map(c => c.permissions));
                    setPermissionUserList(updatedMixtape.collaborators.map(c => (
                        { username: c.username, user: c.user }
                    )));
                }
                setMixtape(updatedMixtape);
                setCoverImageUrl(getMixtapeCoverImageUrl(updatedMixtape._id));
                setTextFieldValue(updatedMixtape.name)
            });
        }
    }, [mixtape, prevMixtape]);

    useEffect(async () => {
        if (permissions && mixtape) {
            const newMixtape = { ...mixtape };
            permissions.forEach((permission, i) => {
                if (newMixtape.collaborators.length < (i+1)) {
                    newMixtape.collaborators.push(permissionUserList[i]);
                }
                if (newMixtape.collaborators[i])
                    newMixtape.collaborators[i].permissions = permission;
            });
            setMixtape(newMixtape);
            await updateMixtape(newMixtape);
            console.log(newMixtape);
        }
    }, [permissions]);

    const handleChangeMixtapeNamePopup = () => {
        const currentValue = changeMixtapeNamePopupIsOpen;
        setChangeMixtapeNamePopupIsOpen(!changeMixtapeNamePopupIsOpen);
        if (changeMixtapeNamePopupIsOpen)
            onSave();
    };

    const handleChangeName = (e) => {
        console.log("Text field value:" + e.target.value);
        if (mixtape) {
            setTextFieldValue(e.target.value);
        }
    }

    const onSave = () => {
        const changeMixtapeNameTransaction = new ChangeMixtapeName_Transaction(mixtape.name, textFieldValue, mixtape);
        tps.addTransaction(changeMixtapeNameTransaction);
        updateMixtape(mixtape);
    }


    const undoHandler = () => {
        var theName = tps.transactions[tps.getSize()-1].constructor.name
        console.log("Top of transaction stack: " + theName);
    
        if(tps.getSize() > 0) {
          switch (theName) {
            case "ChangeMixtapeName_Transaction":
              undoChangeMixtapeName();
              break;
            default:
              console.log("Unknown transaction.");
          }
        }
      }

      const undoChangeMixtapeName = () => {
        console.log("Undo Change Mixtape Name");
        tps.undoTransaction();
        setMixtape(mixtape);
        updateMixtape(mixtape);
        setChangeMixtapeNamePopupIsOpen(false)
      }


    return (
        <div>
            <MixtapeCoverImageUploadModal coverImageUrl={coverImageUrl} setCoverImageUrl={setCoverImageUrl} mixtape={mixtape} setMixtape={setMixtape} open={uploadCoverImagePopup} setOpen={setUploadCoverImagePopup} />
            <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
                <ArrowBackIcon />
            </IconButton>
            <br/>
                
            <br/>
            <Dialog open={changeMixtapeNamePopupIsOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Change Mixtape Name</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the new name:
                        </DialogContentText>
                        <TextField
                            onChange={handleChangeName}
                            value={textFieldValue}
                            variant="filled"
                            InputProps={{ style: { fontSize: '1.5em' }, disableUnderline: false, type: 'search' }}
                        />
                    </DialogContent>
                    <DialogActions flexDirection="row">
                        <Fab align="left" fontSize="small" color="primary" onClick={undoHandler}>
                            <UndoIcon/>
                        </Fab>
                        <Button align="center" onClick={handleChangeMixtapeNamePopup} color="primary">
                            Save
                        </Button>
                    </DialogActions>
            </Dialog>

            <br />
            <br />

            <Paper style={{ height: '10em', padding: '1%', marginLeft: '5%', marginBottom: '2%', width: '70%' }}>
                {/* {isEditing ? <TextField value={mixtape.name} /> : <h1>{mixtape.name || 'Mixtape Title'}</h1>} */}
                <Grid style={{height: '100%', width: '100%'}} container>
                    <Grid style={{height: '100%', width: '100%'}} xs={1} item>
                        <img onClick={() => isEditing ? setUploadCoverImagePopup(true) : undefined} style={{cursor: isEditing ? 'pointer' : '', width: '80%', height: '100%', objectFit: 'contain'}} src={coverImageUrl ? coverImageUrl : ''} />
                    </Grid>
                    <Grid sz={1}>

                        <Button onClick={handleChangeMixtapeNamePopup} startIcon={<EditIcon />}  style={{float: 'right'}} variant="contained">Change Mixtape Name</Button>
                        <Grid xs={10} item>
                            <Typography variant="h4">{mixtape?.name}</Typography>
                            <br />
                            <Typography variant="h6" style={{ display: 'inline-block' }}>{`Created by ${owner} ${mixtape?.songs.length} songs, ${humanizeDuration(mixtape?.duration * 1000).replaceAll(',', '')}`}</Typography>
                        </Grid>
                        <Grid xs={1} item></Grid>
                    </Grid>
                </Grid>
                <Box style={{ display: 'inline-flex', flexDirection: 'row', float: 'right'}}>
                    <FavoriteMixtapeButton id={props.match.params.id} style={{ margin: '10px' }} />
                    <CommentIcon style={{ margin: '10px' }} />
                    <ShareIcon style={{ margin: '10px' }} />
                </Box>
            </Paper>
            <Grid container justify="center">
                <Mixtape permissionUserList={permissionUserList} setPermissionUserList={setPermissionUserList} permissions={permissions} setPermissions={setPermissions} enableEditing={true} isEditing={isEditing} setIsEditing={setIsEditing} mixtape={mixtape} setMixtape={setMixtape} />
            </Grid>
        </div>
    )
}

export default ViewMixtapePage;
