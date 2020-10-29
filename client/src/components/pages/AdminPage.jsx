import React, { useContext } from 'react';
import { Button, Box, Grid, IconButton, Typography , makeStyles, Icon} from '@material-ui/core';
import logo from '../../images/logo.png';
import { useHistory } from 'react-router-dom';
import blueGrey from '@material-ui/core/colors/blueGrey';
import UserContext from '../../contexts/UserContext';
import { Autocomplete } from '@material-ui/lab';
import ReactRoundedImage from "react-rounded-image";
import pfp from '../../images/bottle_pfp.jpg';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {AccountCircle as UserProfile} from '@material-ui/icons';
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
        namePfpContainer: blueGrey[900],
        tabsContainer: blueGrey[900],
        adminRowColor: blueGrey[800],
        buttonContainer: blueGrey[600],
        adminRows: blueGrey[600],
    }

    const containerBorderProps = {
        bgcolor: 'background.paper',
        borderColor: blueGrey[800],
        m: 1,
        border: 1,
        boxShadow: 6,
      };

      const rowBorderProps = {
        bgcolor: 'background.paper',
        borderColor: '#1c108f',
        m: 1,
        border: 1,
        boxShadow: 6,
      };

    const useStyles = makeStyles((theme) => ({
        box_container: {
            padding: theme.spacing(2),
            marginLeft: '10px',
            marginRight: '1000px',
            marginTop: '50px',
            marginBottom: '50px',
            textAlign: 'center',
            color:  theme.palette.info.contrastText,
            background: blueGrey[900],
            maxHeight: 300, 
            overflow: 'auto'
        },
        box_row: {
            padding: theme.spacing(2),
            margin: '10px',
            textAlign: 'center',
            //display: 'inline',
            color:  'white',//theme.palette.text.secondary,
            background: colors.adminRows,
        },
        title_row: {
            padding: theme.spacing(2),
            margin: '10px',
            color:  'white',//theme.palette.text.secondary,
            background: colors.adminRows,
            height: '50%',
            
        },
        name_col: {
            margin: '10px',
            textAlign: 'left',
            color:  'white',//theme.palette.text.secondary,
            background: colors.mixtapeRows,
        },
        collaborators_col: {
            margin: '10px',
            textAlign: 'center',
            color:  'white',//theme.palette.text.secondary,
            background: colors.mixtapeRows,
        },
        favorites_col: {
            margin: '10px',
            textAlign: 'right',
            color:  'white',//theme.palette.text.secondary,
            background: colors.mixtapeRows,
        },
    }));

    const suggestedUsers = [
        {name: 'DDrizzy123'},
        {name: 'TempAdmin'},
        {name: 'TempAdmin12'},
        {name: 'PartyPooper123'},
        {name: 'BobMarley'},
        {name: 'CoolName'},
      ];
    const classes = useStyles();
    // TODO: add user to destructuring when needed
    // Removed for now to avoid build warnings
    const { setUser } = useContext(UserContext);

    const loginAsGuest = () => setUser({ username: 'Guest', isGuest: true, isLoggedIn: true });

    const history = useHistory();
    const goBack = () => { history.push('/') }

    //TODO: Possibly re-align fields
    return (
        
        <div  style={{ color: 'white', left:0 }}>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
            <ArrowBackIcon/>
        </IconButton>
        <br/>
        <Box style={{display: 'inline-flex', 
                            flexDirection: 'row', 
                            backgroundColor: colors.namePfpContainer, 
                            marginRight: '10px',
                            marginBottom: '30px',
                            paddingLeft: '20px',
                            paddingTop: '20px',  
                            paddingBottom: '20px',
                            width: '85%', 
                            height: '30%'}} boxShadow={3} borderRadius={12}>
                    <div style={{display: 'inline-flex', flexDirection: 'column', paddingLeft: '30px', }}>
                        <span style={{display: 'inline-flex', flexDirection: 'row', paddingTop: '30px', paddingBottom: '30px', height: '25%',}}>
                            <Typography style={{ fontSize: '40px'}} align="center" variant="h3">Admin Screen</Typography>
                        </span>
                       
            
                    </div>
        </Box>
        <br/>
        <Button variant="outlined" style={{padding: '50px', marginTop: '10px', height: '40px', width: '200px', backgroundColor: blueGrey[600], color: 'white'}}>Fill Database</Button>
        <Button variant="outlined" style={{marginLeft:'500px', padding: '50px', marginTop: '10px', height: '40px', width: '200px', backgroundColor: blueGrey[600], color: 'white'}}>Clear Database</Button>
        <br/>
        <br/>
        <br/>
        <Box flexDirection="row" >
            <Grid container>
                <Grid item xs={6}>
                    <Box id='popular' style={{width: '100%'}} className={classes.box_container} borderRadius={10} {...containerBorderProps}> 
                        <Typography variant="headline" component="h1">Current Admins</Typography>
                    
                        <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                            DDrizzy123
                        </Box>
                        <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                            TempAdmin
                        </Box>
                        <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                            TempAdmin12
                        </Box>
                        <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                            PartyPooper123
                        </Box>
                        <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                            BobMarley
                        </Box>
                        <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                            CoolName
                        </Box>
                        <Box className={classes.box_row} borderRadius={16} {...rowBorderProps}> 
                            NoobMaster
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={3} />
                <Grid item xs={3}>
                    <Typography style={{ fontSize: '40px'}} variant="h3">Add An Admin</Typography>
                        
                    <Autocomplete 
                        size="small"
                        style={{width:300}}
                        className={classes.inputInput}
                        freeSolo 
                        disableClearable
                        options={suggestedUsers.map((option)=>option.name)}
                        renderInput={(params)=>(
                        <TextField
                        {...params}
                        backgroundColor='white'
                        label="Search..."
                        margin="normal"
                        variant="filled"
                        InputProps={{ ...params.InputProps, type: 'search' }}
                        />
                        )}
                        />
                    <Button variant="outlined" style={{padding: '10px', marginTop: '10px', height: '40px', width: '200px', backgroundColor: blueGrey[600], color: 'white'}}>Add Admin</Button>
                </Grid>
            </Grid>

        </Box>
        

        
        </div>
        
      
  );
}

export default AdminPage;
