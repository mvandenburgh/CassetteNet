import React, { useContext, useState } from 'react';
import { AppBar, Box, Button, Grid, Tab, Tabs, Typography, makeStyles, IconButton } from '@material-ui/core';
import {
    alpha,
    ThemeProvider,
    withStyles,
    createMuiTheme,
  } from '@material-ui/core/styles';
import { getUsername } from '../../utils/api';
import { users } from '../../testData/users.json'
import pfp from '../../images/bottle_pfp.jpg';
import ReactRoundedImage from "react-rounded-image";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }));

//   const MakeRows = ({mixtapes}) => (
//     <>
//       {mixtapes.map(mixtape => (
//         <div className="mixtape" key={mixtape}>{mixtape}</div>
//       ))}
//     </>
//   ); 

    const MakeRows = ({mixtapes}) => (
    <>
      {mixtapes.map(mixtape => (
        <Box margin="5px" padding="10px" bgcolor="#ff9800" className="mixtape" key={mixtape}>{mixtape}</Box>
      ))}
    </>
    ); 

  var favorites = users[1].favoritedMixtapes;
  

function ViewUserPage(props) {
      const useStyles = makeStyles((theme) => ({
        margin: {
            margin: theme.spacing(1),
          },
        TextStyle:{
            color:"white",
        }
      }));

    const classes = useStyles();

    const dummyUser = users[1];
    console.log(dummyUser);

    const history = useHistory();
    const goBack = () => { history.push('/') }

    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
        <div  style={{ color: 'white', left:0 }}>
      
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
            <div className={classes.margin}>
                <div style={{display: 'inline-flex', flexDirection: 'row', backgroundColor: 'red', width: '75%', height: '10%'}}>
                    <ReactRoundedImage image={pfp} roundedSize="1" imageWidth="300" imageHeight="300" />
                    <div style={{display: 'inline-flex', flexDirection: 'column', paddingLeft: '30px', backgroundColor: 'blue'}}>
                        <span style={{display: 'inline-flex', flexDirection: 'row', paddingTop: '30px', paddingBottom: '30px', height: '25%', backgroundColor: 'green'}}>
                            <Typography style={{ fontSize: '40px'}} variant="h3">beautifulfrog735</Typography>
                            <Typography style={{ fontSize: '20px'}} variant="h3">#0001</Typography>
                        </span>
                        <Typography style={{ fontSize: '20px'}} variant="h3">User since: 9/22/20</Typography>
                        <Typography style={{ fontSize: '20px'}} variant="h3">Last seen: 10/29/20</Typography>
                        <Typography style={{ fontSize: '20px'}} variant="h3">Followers: 203</Typography>
                        <Button variant="outlined" style={{paddingLeft: '10px', marginTop: '10px', width: '20px', color: 'white'}}>Follow</Button>
                    </div>
                </div>
                <div style={{width: '75%', backgroundColor: 'pink'}}>
                    <AppBar position="static">
                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                            <Tab label="Created Mixtapes" {...a11yProps(0)} />
                            <Tab label="Favorite Mixtapes" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Box display="flex" flexDirection="row" bgcolor="#2196f3" width="99%">
                            <Box width="33%" textAlign="center" boxShadow={3} borderRight={1} bgcolor="#2196f3">
                                Name
                            </Box>
                            <Box width="33%" textAlign="center" boxShadow={3} borderRight={1} bgcolor="#2196f3">
                                Collaborators
                            </Box>
                            <Box width="33%" textAlign="center" boxShadow={3} bgcolor="#2196f3">
                                Favorites
                            </Box>
                        </Box>
                        <Box margin="5px" bgcolor="#9c27b0"> 
                            
                                <MakeRows mixtapes={favorites} />
                            
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Item Two
                    </TabPanel>
                </div>
            </div>
        </div>
  );
}

export default ViewUserPage;
