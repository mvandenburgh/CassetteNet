import React, { useEffect, useState } from 'react';
import {
    Backdrop,
    Button,
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
    TableHead,
    TableRow,
    Typography,
    TextField,
} from '@material-ui/core';
import { AddCircle as AddIcon, Warning as WarningIcon, Save as SaveIcon } from '@material-ui/icons';
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
        permissions,
        setPermissions,
        permissionUserList,
        setPermissionUserList,
    } = props;

    const history = useHistory();

    const [roleSelectOpen, setRoleSelectOpen] = useState(null);

    const [unsavedPermissions, setUnsavedPermissions] = useState([]);

    const [userToAdd, setUserToAdd] = useState(null);

    useEffect(() => setUnsavedPermissions(permissions), [permissions]);

    const handleRoleChange = (event, index) => {
        const newPermissions = [...unsavedPermissions];
        newPermissions[index] = event.target.value;
        setUnsavedPermissions(newPermissions);
    };

    const handleDeleteMixtape = async (mixtape) => {
        await deleteMixtape(mixtape);
        history.goBack();
    };

    const showSaveIcon = () => {
        if (unsavedPermissions.length !== permissions.length) {
            return true;
        }
        for (let i = 0; i < permissions.length; i++) {
            if (unsavedPermissions[i] !== permissions[i]) {
                return true;
            }
        }
        return false;
    };

    const savePermissions = () => setPermissions(unsavedPermissions);

    const selectUser = (user) => {
        const newPermissions = [...permissions];
        const newPermissionUsers = [...permissionUserList];
        newPermissionUsers.push({
            username: user.username,
            user: user._id,
        });
        newPermissions.push('viewer');
        setPermissions(newPermissions);
        setPermissionUserList(newPermissionUsers);
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
                            <Typography align="center" variant="h5">Permissions</Typography>
                            <Grid item xs={12} style={{ borderRadius: '2%', overflow: 'auto', maxHeight: '100%' }}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>User</StyledTableCell>
                                                <StyledTableCell>
                                                    <Grid container>
                                                        <Grid item xs={10}>
                                                            <span>Role</span>
                                                        </Grid>
                                                        <Grid item xs={2} style={{ display: showSaveIcon() ? '' : 'none' }}>
                                                            <SaveIcon onClick={savePermissions} />
                                                        </Grid>
                                                    </Grid>
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {mixtape?.collaborators.map((collaborator, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>{collaborator?.username}</StyledTableCell>
                                                    <StyledTableCell>
                                                        <Select
                                                            open={roleSelectOpen}
                                                            onClose={() => setRoleSelectOpen(false)}
                                                            onOpen={() => setRoleSelectOpen(true)}
                                                            value={unsavedPermissions[index]}
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
                                    control={<Switch checked={true} onChange={() => undefined} name="checkedA" />}
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
