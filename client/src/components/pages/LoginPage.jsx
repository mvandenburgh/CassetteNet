import React, { useState } from 'react';
import { Button, Grid, Typography, makeStyles, IconButton } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import { userLogin, googleLogin, requestPasswordReset } from '../../utils/api';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FacebookLogin from 'react-facebook-login';
import GoogleButton from 'react-google-button';

function LoginPage(props) {
  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    TextStyle: {
      color: "white",
    }
  }));

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleResponseFacebook = (e) => {
    setPassword(".");
    handleClickOpen();
  }

  const handleGoogleSignUp = () => googleLogin();

  const loginAsUser = async () => {
    try {
      await userLogin(username, password);
      history.push('/login/success');
    } catch (err) {
      if (err.response.status === 401) {
        alert('Incorrect username or password');
      } else if (err.response.status === 400) {
        alert('Please verify your account.')
      } else {
        alert('Error logging in. Please try again later.')
      }
    }
  }

  const forgotPassword = async (email) => {
    requestPasswordReset(email)
      .then(res => alert('Password reset email sent.'))
      .catch(err => alert(err));
  }

  const history = useHistory();
  const goBack = () => history.goBack();

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);


  return (
    <div style={{ color: 'white', left: 0 }}>
      <IconButton color="secondary" aria-label="back" onClick={goBack}>
        <ArrowBackIcon />
      </IconButton>
      <br />
      <br />
      <br />
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter your username:</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the email associated with your account:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email"
            type="email"
            fullWidth
            onChange={handleEmail}
            value={email}
          />
        </DialogContent>
        <DialogActions>
          <Button align="center" onClick={() => forgotPassword(email)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Typography align="center" variant="h3">Log In
      </Typography>
      <div className={classes.margin}>
        <Grid container spacing={1} alignItems="center" direction="column">
          <Grid item sz={1}>
            <GoogleButton onClick={handleGoogleSignUp} />
          </Grid>
          <Grid item sz={1}>
            <FacebookLogin
              size="small"
              appId="667674014139311"
              buttonText="Login With facebook"
              fields="name,email,picture"
              callback={handleResponseFacebook}
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.margin}
              onChange={handleUsername}
              value={username}
              variant="outlined" label="Username" />
          </Grid>
          <Grid item>
            <TextField
              className={classes.margin}
              onChange={handlePassword}
              value={password}
              variant="outlined" type="Password" label="Password" />
          </Grid>
          <Button variant="filled" color="inherit" onClick={loginAsUser}>
            Log In
        </Button>
        <Button variant="filled" color="inherit" onClick={() => setOpen(true)}>
            Forgot Password
        </Button>
        </Grid>
      </div>
    </div>
  );
}

export default LoginPage;
