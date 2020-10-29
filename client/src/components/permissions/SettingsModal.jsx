import React, { useState } from 'react';
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
import { AddCircle as AddIcon, Warning as WarningIcon } from '@material-ui/icons';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { getUsername } from '../../utils/api';
import { users } from '../../testData/users.json';
import { Autocomplete } from '@material-ui/lab';


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
    const { mixtape, setMixtape, settingsPopupIsOpen, handleSettingsPopup } = props;

    const [roleSelectOpen, setRoleSelectOpen] = useState(null);

    const handleRoleChange = (event, index) => {
        const newMixtape = { ...mixtape };
        newMixtape.collaborators[index].permissions = event.target.value;
        setMixtape(newMixtape);
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
                <Grid container style={{backgroundColor: blueGrey[400], height: '70%', width: '60%'}}>
                    <Grid item xs={3} />
                    <Grid item xs={6} justify="center" style={{backgrondColor: 'green'}}>
                        <Typography align="center" variant="h3">Mixtape Settings</Typography>
                        <hr />
                    </Grid>
                    <Grid item xs={3} />

                    <Grid item xs={1} />
                    <Grid item xs={4} style={{ height: '70%' }}>
                        <Grid container style={{height: '80%'}} >
                            <Typography align="center" variant="h5">Permissions</Typography>
                            <Grid item xs={12} style={{overflow: 'auto', maxHeight: '100%' }}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                            <StyledTableCell>User</StyledTableCell>
                                            <StyledTableCell>Role</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {mixtape.collaborators.map((collaborator, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{getUsername(collaborator.user)}</StyledTableCell>
                                                <StyledTableCell>
                                                <Select
                                                open={roleSelectOpen}
                                                onClose={() => setRoleSelectOpen(null)}
                                                onOpen={() => setRoleSelectOpen(index)}
                                                value={collaborator.permissions}
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
                            
                            <Grid container style={{marginTop: '1em'}}>
                                <Grid item xs={10}>
                                    <Autocomplete
                                    style={{backgroundColor: 'white', width: '85%'}}
                                    size="small"
                                    freeSolo 
                                    disableClearable
                                    options={users.map(user => user.username)}
                                    renderInput={(params)=>(
                                        <TextField
                                        {...params}
                                        label="Search for a user..."
                                        variant="filled"
                                        InputProps={{ style: { fontSize: '1.5em' }, disableUnderline: true, type: 'search' }}
                                        />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <Button variant="contained" style={{width: '90%', height: '100%'}}><AddIcon /></Button>
                                </Grid>
                                <Grid item xs={1} style={{width: '100%', height: '100%'}} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2} />
                    <Grid item xs={4} style={{margin: '10% 0'}}>
                        <Grid container justify="center" alignItems="center" style={{height: '50%'}}>
                            <Grid item xs={12} justify="center">
                                <FormControlLabel
                                    control={<Switch checked={true} onChange={() => undefined} name="checkedA" />}
                                    label="Mixtape Public?"
                                />
                            </Grid>
                        </Grid>
                        <Grid container justify="center" alignItems="center">
                            <Grid item xs={12} justify="center">
                                <Button
                                variant="contained"
                                color="secondary"
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
