import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  makeStyles,
  IconButton
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Alert } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import { userLogin, oauthLogin, requestPasswordReset } from '../../utils/api';

import GoogleButton from 'react-google-button';
import { FacebookLoginButton } from 'react-social-login-buttons';

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

  const handleGoogleSignUp = () => oauthLogin('google');

  const handleFacebookSignUp = () => oauthLogin('facebook');

  const loginAsUser = async () => {
    try {
      await userLogin(email, password);
      history.push('/login/success');
    } catch (err) {
      if (err?.response?.status === 401) {
        setLoginError('Incorrect email or password.');
      } else if (err?.response?.status === 400) {
        setLoginError('Please verify your account.');
      } else {
        setLoginError('Error logging in. Please try again later.')
      }
    }
  }

  const [loginError, setLoginError] = useState(null);

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [invalidForgotPasswordEmail, setInvalidForgotPasswordEmail] = useState(false);
  const handleResetPasswordEmail = (e) => {
    if (invalidForgotPasswordEmail) {
      setInvalidForgotPasswordEmail(false);
    }
    setForgotPasswordEmail(e.target.value);
  }

  const forgotPassword = async () => {
    requestPasswordReset(forgotPasswordEmail)
      .then(res => alert('Password reset email sent.'))
      .catch(err => setInvalidForgotPasswordEmail(true));
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
            onChange={handleResetPasswordEmail}
            value={forgotPasswordEmail}
          />
          {invalidForgotPasswordEmail ?
          <Alert severity="error">A user with that email does not exist.</Alert>
          : undefined}
        </DialogContent>
        <DialogActions>
          <Button align="center" onClick={forgotPassword} color="primary">
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
            <FacebookLoginButton onClick={handleFacebookSignUp}>
              <span>Sign in with Facebook</span>
            </FacebookLoginButton>
          </Grid>
          <Typography variant="h6">OR</Typography>
          {loginError ?
            <Alert severity="error">{loginError}</Alert>
          : undefined}
          <Grid item>
            <TextField
              className={classes.margin}
              onChange={handleEmail}
              value={email}
              variant="outlined" label="Email" />
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
