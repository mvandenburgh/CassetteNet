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

  const { user, setUser } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginAsUser = async () => {
    const loggedInUser = await userLogin(username, password);
    if (loggedInUser) {
      setUser({ isLoggedIn: true, isGuest: false, ...loggedInUser });
      history.push('/');
    }
    else{
      //TODO: turn this into a dialog box
      alert("Incorrect Username or password!");
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
      <Typography align="center" variant="h3">Log In
      </Typography>
      <div className={classes.margin}>
        <Grid container spacing={1} alignItems="center" direction="column">
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
