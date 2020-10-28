import React, { useContext, useState } from 'react';
import { Button, Grid, Typography, makeStyles, IconButton } from '@material-ui/core';
import {
    alpha,
    ThemeProvider,
    withStyles,
    createMuiTheme,
  } from '@material-ui/core/styles';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { getUsername } from '../../utils/api';
import { users } from '../../testData/users.json'
import pfp from '../../images/bottle_pfp.jpg';
import ReactRoundedImage from "react-rounded-image";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

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
                <Tabs>
                    <TabList>
                        <Tab>Created Mixtapes</Tab>
                        <Tab>Favorited Mixtapes</Tab>
                    </TabList>
                
                    <TabPanel>
                        <h2>Any content 1</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>Any content 2</h2>
                    </TabPanel>
                </Tabs>
                </div>
            </div>
        </div>
  );
}

export default ViewUserPage;
