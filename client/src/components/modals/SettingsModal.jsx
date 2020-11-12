import React, { useEffect, useState } from 'react';
import {
    Backdrop,
    Button,
    Checkbox,
    Fade,
    FormControlLabel,
    Grid,
    MenuItem,
    Modal,
    Paper,
    Select,
    Switch,
    Table,
    TableBody,
    TableContainer,
    TableCell,
    TableRow,
    Typography,
} from '@material-ui/core';
import { AddCircle as AddIcon, Warning as WarningIcon, Check as DoneIcon, Edit as EditIcon, DeleteForever as DeleteIcon } from '@material-ui/icons';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import UserSearchBar from '../UserSearchBar';
import { deleteMixtape } from '../../utils/api';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function SettingsModal(props) {
    const classes = useStyles();

    const {
        mixtape,
        setMixtape,
        settingsPopupIsOpen,
        handleSettingsPopup,
    } = props;

    const history = useHistory();

    const [roleSelectOpen, setRoleSelectOpen] = useState(null);

    const [unsavedCollaborators, setUnsavedCollaborators] = useState([]);

    const [editing, setEditing] = useState(false);

    const [toDelete, setToDelete] = useState([]);

    useEffect(() => {
        if (mixtape?.collaborators)
            setUnsavedCollaborators(mixtape.collaborators);
    }, [mixtape]);

    const handleCheckbox = (collaborator) => {
        const newToDelete = [...toDelete];
        newToDelete.push(collaborator.user);
        setToDelete(newToDelete);
    }

    const handleClickGarbage = () => {
        const newCollaborators = [...unsavedCollaborators].filter(c => !toDelete.includes(c.user));
        setUnsavedCollaborators(newCollaborators);
    }

    const handleRoleChange = (event, index) => {
        const newCollaborators = [...unsavedCollaborators];
        newCollaborators[index].permissions = event.target.value;
        setUnsavedCollaborators(newCollaborators);
    };

    const handleDeleteMixtape = async (mixtape) => {
        await deleteMixtape(mixtape);
        history.goBack();
    };

    const showDoneIcon = () => {
        return mixtape?.collaborators.length !== unsavedCollaborators.length || editing;
    };

    const savePermissions = () => {
        setEditing(false);
        mixtape.collaborators = unsavedCollaborators;
        setMixtape(mixtape);
    }

    const selectUser = (newUser) => {
        if (!newUser) return;
        const newCollaborators = [...unsavedCollaborators];
        const { username, _id } = newUser;
        newCollaborators.push({ username, user: _id, permissions: 'viewer' });
        setUnsavedCollaborators(newCollaborators);
    }

    const changePublicStatus = () => {
        mixtape.isPublic = !mixtape.isPublic;
        setMixtape(mixtape);
    }

    return (
        <Modal
            className={classes.modal}
            open={settingsPopupIsOpen}
            onClose={handleSettingsPopup}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={settingsPopupIsOpen}>
                <Grid container style={{ backgroundColor: blueGrey[400], height: '70%', width: '60%' }}>
                    <Grid item xs={3} />
                    <Grid item xs={6} style={{ backgrondColor: 'green' }}>
                        <Typography align="center" variant="h3">Mixtape Settings</Typography>
                        <hr />
                    </Grid>
                    <Grid item xs={3} />

                    <Grid item xs={1} />
                    <Grid item xs={4} style={{ height: '70%' }}>
                        <Grid container style={{ height: '80%' }} >
                            <Grid item xs={12}>
                                <Typography align="center" variant="h5">Permissions</Typography>
                            </Grid>
                            <Grid container style={{ borderRadius: '2%', backgroundColor: 'black' }}>
                                <Grid item xs={5}>
                                    <Typography style={{ color: 'white' }} align="center" variant="h6">User</Typography>
                                </Grid>
                                <Grid item xs={1} />
                                <Grid item xs={4}>
                                    <Typography style={{ color: 'white' }} align="center" variant="h6">Role</Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    {editing ?
                                        <DeleteIcon align="right" style={{ color: 'white' }} onClick={handleClickGarbage} />
                                        :
                                        <EditIcon align="right" style={{ color: 'white' }} onClick={() => setEditing(true)} />
                                    }
                                </Grid>
                                <Grid item xs={1} style={{ display: showDoneIcon() ? '' : 'none' }}>
                                    <DoneIcon align="right" style={{ color: 'white' }} onClick={savePermissions} />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} style={{ overflow: 'auto', maxHeight: '100%' }}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            {unsavedCollaborators.map((collaborator, index) => (
                                                <StyledTableRow key={index}>
                                                    {editing ? <StyledTableCell><Checkbox onChange={() => handleCheckbox(collaborator)} /></StyledTableCell> : undefined}
                                                    <StyledTableCell>{collaborator?.username}</StyledTableCell>
                                                    <StyledTableCell>
                                                        <Select
                                                            open={roleSelectOpen}
                                                            onClose={() => setRoleSelectOpen(false)}
                                                            onOpen={() => setRoleSelectOpen(true)}
                                                            value={unsavedCollaborators[index]?.permissions}
                                                            onChange={(e) => handleRoleChange(e, index)}
                                                        >
                                                            <MenuItem value={'owner'}>Owner</MenuItem>
                                                            <MenuItem value={'viewer'}>Viewer</MenuItem>
                                                            <MenuItem value={'editor'}>Editor</MenuItem>
                                                        </Select>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            <Grid container style={{ marginTop: '1em' }}>
                                <Grid item xs={10}>
                                    <UserSearchBar userSelectHandler={selectUser} />
                                </Grid>
                                <Grid item xs={1}>
                                    <Button style={{ marginTop: '1em' }} variant="contained"><AddIcon /></Button>
                                </Grid>
                                <Grid item xs={1} style={{ width: '100%', height: '100%' }} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs={3} style={{ margin: '10% 0' }}>
                        <Grid container justify="center" alignItems="center" style={{ height: '50%' }}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Switch value={mixtape.isPublic} onChange={changePublicStatus} />}
                                    label="Mixtape Public?"
                                />
                            </Grid>
                        </Grid>
                        <Grid container justify="center" alignItems="center">
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDeleteMixtape(mixtape)}
                                    startIcon={<WarningIcon />}
                                >
                                    Delete Mixtape
                              </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={1} />
                </Grid>
            </Fade>
        </Modal>

    )
}

export default SettingsModal;
