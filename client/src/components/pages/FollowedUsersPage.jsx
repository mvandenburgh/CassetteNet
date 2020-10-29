import React, { useContext, useState } from 'react';
import { AppBar, Box, Button, Grid, Tab, Tabs, Typography, makeStyles, IconButton } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { users } from '../../testData/users.json'
import ReactRoundedImage from "react-rounded-image";
import dio_pfp from '../../images/dio_pfp.jpg';
import donna_pfp from '../../images/donna.jpg';
import pepe_pfp from '../../images/pepe_pfp.png';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';



function FollowedUsersPage(props) {
  const colors = {
      followedUserRowColor: blueGrey[900]
  }

  var theirFollowedUsers = [
    {
        name: 'purplefish313',
        last_seen: '10/1/2020',
        user_since: '9/28/2020',
        followers: '112',
        pfp: dio_pfp
    },
    {
        name: 'biglion179',
        last_seen: '10/25/2020',
        user_since: '10/14/2020',
        followers: '32',
        pfp: donna_pfp
    },
    {
        name: 'silverpanda429',
        last_seen: '10/27/2020',
        user_since: '9/13/2020',
        followers: '93', 
        pfp: pepe_pfp
    },
]

  const FollowedUserRows = ({followedUsers}) => (
    <>
      {followedUsers.map(user => (
        <Box style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: colors.followedUserRowColor,
            display: "flex", 
            flexDirection: "row",
            borderRadius: 6,
            fontSize: 12,
        }}>
            <Box style={{ width: "33%", display: 'flex', flexDirection: 'row', marginLeft: '15px'}}>
                <ReactRoundedImage image={user.pfp} roundedSize="1" imageWidth="50" imageHeight="50" />
                <Box style={{ width: "50%", display: 'flex', justifyContent: "left", marginLeft: '15px'}}> {user.name} </Box>
            </Box>
            
            
            <Box style={{ width: "33%", display: 'flex', flexDirection: 'column'}}> 
                Last seen: {user.last_seen}
                <br/>
                User since: {user.user_since}
                <br/>
                Followers: {user.followers}
            </Box>
            <Box style={{ width: "25%", display: 'flex', justifyContent: "center"}}>
                <Button variant="outlined">Unfollow</Button>
            </Box>
        </Box>
      ))}
    </>
    ); 



  const history = useHistory();
  const goBack = () => { history.push('/') }

  return (
      <div  style={{ color: 'white', left:0 }}>
    
          <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
            <ArrowBackIcon/>
          </IconButton>
          <br/>

          <div style={{ width: "80%"}}>
            <FollowedUserRows followedUsers={theirFollowedUsers} />
          </div>
      </div>
);
}

export default FollowedUsersPage;