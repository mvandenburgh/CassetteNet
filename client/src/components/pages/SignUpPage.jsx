import React, { useContext } from 'react';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import logo from '../../images/logo.png';
import UserContext from '../../contexts/UserContext';
import {
    alpha,
    ThemeProvider,
    withStyles,
    createMuiTheme,
  } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';

function SignUpPage(props) {
    const CssTextField = withStyles({
        root: {
            '& label':{
                color:'white'
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

       
    const colors = {
        buttonContainer: '#0A1941',
        loginButton: '#115628',
        signUpButton: '#561111',
        guestButton: '#6B6B6B',
    }
    const useStyles = makeStyles((theme) => ({
        margin: {
            margin: theme.spacing(1),
          },
        TextStyle:{
            color:"white",
        }
      }));
    const classes = useStyles();
    // TODO: add user to destructuring when needed
    // Removed for now to avoid build warnings
    const { setUser } = useContext(UserContext);

    const loginAsGuest = () => setUser({ username: 'Guest', isGuest: true, isLoggedIn: true });


    //TODO: Possibly re-align fields
    return (
        <div  style={{ color: 'white' }}>
      <Typography align="center" variant="h3">
          Sign Up Fields
      <br/>
      <br/>
      </Typography>
      <div className={classes.margin}>
        
        <Grid container spacing={1} alignItems="center" direction="column">
          
          <Grid item>
          <CssTextField
            className={classes.margin}
            variant="outlined" label="First Name"/>
          </Grid>
          <Grid item>
          <CssTextField
            className={classes.margin}
            variant="outlined" label="Last Name" />
          </Grid>
          <Grid item>
          <CssTextField
            className={classes.margin}
            variant="outlined" label="Username" />
          </Grid>
          <Grid item>
          <CssTextField
            className={classes.margin}
            variant="outlined" type="Password" label="Password" />
          </Grid>
          <Grid item>
          <CssTextField
            className={classes.margin}
            label="Email"
            variant="outlined"
            id="custom-css-outlined-input"
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default SignUpPage;
