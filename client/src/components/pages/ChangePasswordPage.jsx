import React, { useContext } from 'react';
import { Button, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import {green} from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function ChangePasswordPage(props) {
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
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
       
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

    const theme = createMuiTheme({
        palette: {
          primary: green,
        },
      });

    //TODO: Possibly re-align fields
    return (
        <div  style={{ color: 'white', left:0}}>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
                
            <br/>
            <br/>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Password saved!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your new password was saved!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button align="center" onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Typography align="center" variant="h3">
      <br/>
          Change Password
      <br/>
      <br/>
      </Typography>
      <div className={classes.margin}>
        
        <Grid container spacing={1} alignItems="center" direction="column">
        
          <Grid item>
          <CssTextField
            style={{width:300}}
            className={classes.margin}
            variant="outlined" type="Password" label="Password" />
          </Grid>
          <Grid item>
          <CssTextField
            style={{width:300}}
            className={classes.margin}
            variant="outlined" type="Password" label="Reenter New Password" />
          </Grid>
          <ThemeProvider theme={theme}>
            <Button onClick={handleClickOpen} variant="contained" color="primary" className={classes.margin}>
                Save New Password
            </Button>
          </ThemeProvider>
          
        </Grid>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
