import React, { useState } from 'react';
import { Button, Grid, IconButton, TextField, Typography, makeStyles, Tooltip, Snackbar } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import InfoIcon from '@material-ui/icons/Info';
import { useHistory } from 'react-router-dom';
import { userSignup } from '../../utils/api';

function SignUpPage(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);

  const submit = () => {
    if(username.length < 4) {
      setOpen(true);
    }
    else {
      setOpen(false);
      userSignup(email, username, password)
      .then(() => alert('Sign up successful!'))
      .catch(err => alert(err));
    }
  };

  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    TextStyle: {
      color: "white",
    },
    photo: {
      height: '100px',
      width: '100px',
      marginLeft: '20px',
      marginRight: '20px',
    }
  }));
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const history = useHistory();
  const goBack = () => history.goBack();

  //TODO: Possibly re-align fields
  return (
    <div style={{ color: 'white', left: 0 }}>

      <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
        <ArrowBackIcon />
      </IconButton>


      <Typography align="center" variant="h3">
        <br />
          Sign Up
      <br />
        <br />
      </Typography>
      <Grid container spacing={1} alignItems="center" direction="column">
        <Grid container spacing={1} alignItems="center" direction="row">
        <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                open={open}
                autoHideDuration={4000}
                // onClose={handleClose}
                message="Username must be between 4 and 12 characters."
                // action={
                //     <React.Fragment>
                //         <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                //             <CloseIcon fontSize="small" />
                //         </IconButton>
                //     </React.Fragment>
                // }
              >
                </Snackbar>
            <Grid item>

              <TextField
                className={classes.margin}
                onChange={handleUsername}
                value={username}
                variant="outlined" label="Username" />
                
            </Grid>
            <Tooltip title="Username: must be at least 4 characters long and may not begin with #"  >
              <InfoIcon  />
            </Tooltip>
        </Grid>
        <Grid item>
          <TextField
            className={classes.margin}
            onChange={handlePassword}
            value={password}
            variant="outlined" type="Password" label="Password" />
        </Grid>
        <Grid item>
          <TextField
            className={classes.margin}
            onChange={handleEmail}
            value={email}
            label="Email"
            variant="outlined"
            id="custom-css-outlined-input"
          />
        </Grid>
        <Button variant="filled" color="inherit" onClick={submit}>
          Create My Account
          </Button>
      </Grid>
    </div>
  );
}

export default SignUpPage;
