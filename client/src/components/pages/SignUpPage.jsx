import React, { useState } from 'react';
import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, makeStyles, Tooltip } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon, Info as InfoIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { userSignup } from '../../utils/api';
import passwordValidator from 'password-validator';
import emailValidator from 'email-validator';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '25ch',
  },
}));

function SignUpPage(props) {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);

  const validateEmail = () => emailValidator.validate(email);
  const validateUsername = () => username.length >= 4 && username.length <= 12 && username[0] != '#';

  const schema = new passwordValidator();
  schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 1 digits
    .has().not().spaces()                           // Should not have spaces
    .has().symbols(1)
  //.has().oneOf(['!', '@', '#', '$', '%', '&', '*']);

  const validatePassword = () => schema.validate(password);

  const submit = () => {
    if (!validateUsername()) {
      setErrorText('Username must be between 4 and 12 characters and may not begin with #.');
    } else if (!validatePassword()) {
      setErrorText('Password must be at least 8 characters in length, with no spaces and at least 1 of the following: Uppercase, lowercase, number, special character (!, @, #, $, %, &, *).');
    } else if (!validateEmail()) {
      setErrorText('Please enter a valid email address.');
    } else {
      setErrorText(null);
    }
    if (validateUsername() && validatePassword() && validateEmail()) {
      userSignup(email, username, password)
        .then(() => alert('Sign up successful! Please check your email for a verification link.'))
        .catch(err => setErrorText(err?.response?.data?.message));
    }
  };

  const [errorText, setErrorText] = useState(null);

  const history = useHistory();
  const goBack = () => history.goBack();

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
        {errorText ?
          <Grid item>
            <Alert className={classes.margin} style={{ maxWidth: '70%', margin: '0 auto', textAlign: 'center' }} align="center" severity="error">{errorText}</Alert>
          </Grid>
          : undefined
        }
        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
          <InputLabel htmlFor="username">Username</InputLabel>
          <OutlinedInput
            id="username"
            InputLabelProps={{ style: { pointerEvents: "auto" } }}
            onChange={handleUsername}
            value={username}
            variant="outlined" label="Username"
            endAdornment={
              <InputAdornment position="end">
                <Tooltip style={{ cursor: 'default' }} title="Username: must be at least 4 characters long and may not begin with #"  >
                  <InfoIcon />
                </Tooltip>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            onChange={handlePassword}
            value={password}
            variant="outlined"
            type="Password"
            id="password"
          />
        </FormControl>
        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
          <TextField
            onChange={handleEmail}
            value={email}
            label="Email"
            variant="outlined"
            id="custom-css-outlined-input"
          />
        </FormControl>
      <Button variant="filled" color="inherit" onClick={submit}>
        Create My Account
          </Button>
      </Grid>
    </div >
  );
}

export default SignUpPage;
