import React from 'react';
import { Button, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import {
    ThemeProvider,
    withStyles,
    createMuiTheme,
  } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import {green} from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function ChangePasswordPage() {
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

    const useStyles = makeStyles((theme) => ({
        margin: {
            margin: theme.spacing(1),
          },
        TextStyle:{
            color:"white",
        }
      }));
    const classes = useStyles();

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
