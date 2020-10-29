import React, { useContext } from 'react';
import { Button, Grid, IconButton, Typography , makeStyles} from '@material-ui/core';
import logo from '../../images/logo.png';
import { useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
function AdminPage(props) {
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

    const history = useHistory();
    const goBack = () => { history.push('/') }

    //TODO: Possibly re-align fields
    return (
        <div  style={{ color: 'white', left:0}}>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
      <Typography align="left" variant="h3">
  
            View User
      <br/>
      <br/>
      </Typography>
      </div>
      
  );
}

export default AdminPage;
