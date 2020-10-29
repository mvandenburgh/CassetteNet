import React, { useContext } from 'react';
import { Button, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import logo from '../../images/logo.png';
import UserContext from '../../contexts/UserContext';
import Google from '../../images/Google.png';
import FB from '../../images/facebook.png';
import { CardMedia } from '@material-ui/core';
import {
    alpha,
    ThemeProvider,
    withStyles,
    createMuiTheme,
  } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

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
        },
        photo:{
          height:'100px',
          width:'100px',
          marginLeft:'20px',
          marginRight:'20px',
        }
      }));
    const classes = useStyles();
    // TODO: add user to destructuring when needed
    // Removed for now to avoid build warnings
    const { setUser } = useContext(UserContext);

    const loginAsGuest = () => setUser({ username: 'Guest', isGuest: true, isLoggedIn: true });

    const history = useHistory();
    const goBack = () => { history.push('/') }

    //TODO: Possibly re-align fields
    return (
        <div  style={{ color: 'white', left:0}}>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
                
            <br/>
            <br/>
      <Typography align="center" variant="h3">
      <br/>
          Sign Up
      <br/>
      <br/>
      </Typography>
      <div className={classes.margin}>
        
        <Grid container spacing={1} alignItems="center" direction="column">
          <Grid item sz={1}>
          <a href="SignUp"><img src={Google} className={classes.photo} alt="Google"/></a>
          <a href="SignUp"><img src={FB} className={classes.photo} alt="Google"/></a>
          </Grid>
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
          <Button variant="filled" color="inherit">
            Create My Account
        </Button>
        </Grid>
      </div>
    </div>
  );
}

export default SignUpPage;
