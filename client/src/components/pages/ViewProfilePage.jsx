import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AppBar, Box, Button, Grid, Tab, Tabs, Typography, makeStyles, IconButton } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import fb from '../../images/facebook.png';
import twitter from '../../images/twitter.jpg';
import ReactRoundedImage from 'react-rounded-image';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import UserProfilePictureUploadModal from '../modals/UserProfilePictureUploadModal';
import ChangePasswordConfirmationModal from '../modals/ChangePasswordConfirmationModal';
import { getUserProfilePictureUrl } from '../../utils/api';


function ViewProfilePage(props) {
  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    TextStyle: {
      color: "white",
    }
  }));

  const colors = {
    namePfpContainer: blueGrey[900],
    tabsContainer: blueGrey[900],
    mixtapeRowColor: blueGrey[800]
  }

  const { id } = props.match.params;

  const { user } = useContext(UserContext);

  const userSince = new Date(user.createdAt);
  const lastActivity = new Date(user.updatedAt);

  const [profilePictureUploadModalOpen, setProfilePictureUploadModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  const history = useHistory();
  const goBack = () => history.goBack();

  if(!user?.isLoggedIn) {
    return(
      <Redirect to="/" />
    );
  }

  return (
    <div style={{ color: 'white', left: 0 }}>

      <IconButton color="secondary" aria-label="back" onClick={() => goBack()}>
        <ArrowBackIcon />
      </IconButton>
      <br />
      <div >
        <ChangePasswordConfirmationModal open={changePasswordModalOpen} setOpen={setChangePasswordModalOpen} />

        <UserProfilePictureUploadModal
          open={profilePictureUploadModalOpen}
          setOpen={setProfilePictureUploadModalOpen}
        />


        <Box style={{
          display: 'inline-flex',
          flexDirection: 'row',
          backgroundColor: colors.namePfpContainer,
          marginRight: '10px',
          marginBottom: '30px',
          marginLeft: '100px',
          paddingLeft: '20px',
          paddingTop: '20px',
          paddingBottom: '30px',
          width: '85%',
          height: '30%'
        }} boxShadow={3} borderRadius={12}>
          <Grid container>
            <Grid item xs={3}>
              <ReactRoundedImage image={getUserProfilePictureUrl(user._id)} roundedSize="1" imageWidth="300" imageHeight="300" />
            </Grid>
            <Grid item xs={6}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', paddingLeft: '30px', }}>
                <span style={{ display: 'inline-flex', flexDirection: 'row', paddingTop: '30px', paddingBottom: '30px', height: '25%', }}>
                  <Typography style={{ fontSize: '40px' }} variant="h3">{user.username}</Typography>
                  <Typography style={{ fontSize: '20px' }} variant="h3">#{user.uniqueId}</Typography>
                </span>
                <Typography style={{ fontSize: '20px' }} variant="h3">User since: {userSince.getMonth() + 1}/{userSince.getDate()}/{userSince.getFullYear()}</Typography>
                <Typography style={{ fontSize: '20px' }} variant="h3">Last activity: {lastActivity.getMonth() + 1}/{lastActivity.getDate()}/{lastActivity.getFullYear()}</Typography>
                <Typography style={{ fontSize: '20px' }} variant="h3">Followers: {user.followers}</Typography>

              </div>
            </Grid>
            <Grid item xs={3}></Grid>
            <Button
              onClick={() => setProfilePictureUploadModalOpen(true)}
              variant="outlined"
              style={{
                marginLeft: '50px',
                marginTop: '10px',
                height: '40px',
                width: '200px',
                backgroundColor: blueGrey[600],
                color: 'white'
              }}>Change Picture</Button>
          </Grid>
        </Box>

        <Grid container>
          <Grid item xs={2}>
            {user?.strategy === 'local' ?
              <Button
                variant="outlined"
                style={{
                  marginLeft: '100px',
                  marginTop: '10px',
                  height: '70px',
                  width: '300px',
                  backgroundColor: blueGrey[600],
                  color: 'white'
                }}
                onClick={() => setChangePasswordModalOpen(true)}
              >Change Password</Button>
              : undefined}
          </Grid>
          <Grid item xs={1} style={{ display: user.admin ? '' : 'none' }}>
            <Button
              onClick={() => history.push('/admin')}
              variant="outlined"
              style={{
                marginLeft: '200px',
                marginTop: '10px',
                height: '70px',
                width: '300px',
                backgroundColor: blueGrey[600],
                color: 'white'
              }}>Admin Screen</Button>
          </Grid>
        </Grid>

      </div>
    </div>
  );
}

export default ViewProfilePage;
