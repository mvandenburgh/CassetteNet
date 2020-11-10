import React, { useContext, useState } from 'react';
import { Button, Grid, Typography, makeStyles, IconButton } from '@material-ui/core';
import {
  alpha,
  withStyles,
} from '@material-ui/core/styles';
import logo from '../../images/logo.png';
import UserContext from '../../contexts/UserContext';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import { userLogin } from '../../utils/api';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

function LoginPage(props) {
  const colors = {
    buttonContainer: '#0A1941',
    loginButton: '#115628',
    signUpButton: '#561111',
    guestButton: '#6B6B6B',
  }

  const CssTextField = withStyles({
    root: {
      '& label': {
        color: 'white'
      },
      '& label.Mui-focused': {
        color: 'black',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        },
      },
    },
  })(TextField);

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
  const { user, setUser } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleClickOpen = () => setOpen(true);
  const handleClose = () =>  {
    setOpen(false);
    setPassword(".");
    loginAsUser();
  };
  const handleResponseFacebook = (e) => {
    setPassword(".");
    handleClickOpen();
  }

  const handleGoogleSignUp = (e) => {
    setPassword(".");
    handleClickOpen();
  }



  const loginAsUser = async () => {
    try {
      const loggedInUser = await userLogin(username, password);
      setUser({ isLoggedIn: true, isGuest: false, ...loggedInUser });
      history.push('/');
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

  const history = useHistory();
  const goBack = () => history.push('/');

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

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
            Enter the username associated with your account:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            type="email"
            fullWidth
            onChange={handleUsername}
            value={username}
          />
        </DialogContent>
        <DialogActions>
          <Button align="center" onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      
      <Typography align="center" variant="h3">Log In
      </Typography>
      <div className={classes.margin}>
        <Grid container spacing={1} alignItems="center" direction="column">
      <Grid item sz= {1}>
            <GoogleLogin 
            theme="dark"
            clientId="981574880383-1i69fqkdqevp29mavc6oi3hlq878trpl.apps.googleusercontent.com"
            buttonText="Login With google"
            onSuccess={handleGoogleSignUp}
            cookiePolicy={'single_host_origin'}
          />
          </Grid>
          <Grid item sz= {1}>
          <FacebookLogin 
            size = "small"
            appId="667674014139311"
            buttonText="Login With facebook"
            fields="name,email,picture"
            callback={handleResponseFacebook}
          />
          
          </Grid>
          <Grid item>
            <TextField
              className={classes.margin}
              onChange={(e) => handleUsername(e)}
              value={username}
              variant="outlined" label="Username" />
          </Grid>
          <Grid item>
            <TextField
              className={classes.margin}
              onChange={(e) => handlePassword(e)}
              value={password}
              variant="outlined" type="Password" label="Password" />
          </Grid>
          <Button variant="filled" color="inherit" onClick={loginAsUser}>
            Log In
        </Button>
        </Grid>
      </div>
    </div>
  );
}

export default LoginPage;
