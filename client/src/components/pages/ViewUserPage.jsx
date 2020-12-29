import React, { useContext, useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
  Typography,
  IconButton
} from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import ReactRoundedImage from "react-rounded-image";
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { getUser, getUserProfilePictureUrl, getCreatedMixtapes, getFavoritedMixtapes, sendDM } from '../../utils/api';
import FollowUserButton from '../FollowUserButton';
import UserContext from '../../contexts/UserContext';
import Tooltip from '@material-ui/core/Tooltip';
import MixtapeRows from '../MixtapeRows';
import SocketIOContext from '../../contexts/SocketIOContext';

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

function ViewUserPage(props) {
  const colors = {
    namePfpContainer: blueGrey[900],
    tabsContainer: blueGrey[900],
    mixtapeRowColor: blueGrey[800]
  }

  const { id } = props.match.params;

  const { user } = useContext(UserContext);

  const [userState, setUserState] = useState({});

  const [createdMixtapes, setCreatedMixtapes] = useState([]);
  const [favoritedMixtapes, setFavoritedMixtapes] = useState([]);

  useEffect(() => {
    async function getUserInfo() {
      if (id) {
        const userInfo = await getUser(id);
        setUserState(userInfo);
        const userCreatedMixtapes = await getCreatedMixtapes(id);
        setCreatedMixtapes(userCreatedMixtapes);
        const userFavoritedMixtapes = await getFavoritedMixtapes(id);
        setFavoritedMixtapes(userFavoritedMixtapes);
      }
    }
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userSince = new Date(userState.createdAt);
  const lastActivity = new Date(userState.updatedAt);

  const history = useHistory();
  const goBack = () => history.goBack();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [message, setMessage] = useState('');

  const { socket } = useContext(SocketIOContext);

  const [writeMessageDialogOpen, setWriteMessageDialogOpen] = useState(false);

  const sendDMHandler = () => {
    if (message) {
      sendDM(userState._id, message).then(() => socket.emit('sendInboxMessage', { recipientId: userState._id }));
    }
    setWriteMessageDialogOpen(false);
    setMessage('');
  }

  if (!userState.username) {
    return null;
  }

  return (
    <div style={{ color: 'white', left: 0 }}>
      <Dialog open={writeMessageDialogOpen} onClose={() => setWriteMessageDialogOpen(false)}>
        <DialogTitle>Write a Message!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write here...
                    </DialogContentText>
          <TextField
            multiline
            rows={17}

            style={{ width: '400px' }}
            autoFocus
            variant="filled"
            margin="dense"
            id="name"
            label="Message"
            type="email"
            fullWidth
            inputProps={{ maxLength: 250 }}
            helperText={`${message.length}/250 characters`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button align="center" onClick={sendDMHandler} color="primary">
            SEND
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
        <ArrowBackIcon />
      </IconButton>
      <br />
      <div >
        <Box style={{
          display: 'inline-flex',
          flexDirection: 'row',
          backgroundColor: colors.namePfpContainer,
          marginRight: '10px',
          marginLeft: '100px',
          marginBottom: '30px',
          paddingLeft: '20px',
          paddingTop: '20px',
          paddingBottom: '20px',
          width: '85%',
          height: '30%'
        }} boxShadow={3} borderRadius={12}>
          <ReactRoundedImage image={getUserProfilePictureUrl(userState?._id)} roundedSize="1" imageWidth="300" imageHeight="300" />
          <div style={{ display: 'inline-flex', flexDirection: 'column', paddingLeft: '30px', }}>
            <span style={{ display: 'inline-flex', flexDirection: 'row', paddingTop: '30px', paddingBottom: '30px', height: '25%', }}>
              <Typography style={{ fontSize: '40px' }} variant="h3">{userState.username}</Typography>
              <Typography style={{ fontSize: '20px' }} variant="h3">#{userState.uniqueId.toString(36).padStart(4, '0').toUpperCase()}</Typography>
            </span>
            <Typography style={{ fontSize: '20px' }} variant="h3">User since: {userSince.getMonth() + 1}/{userSince.getDate()}/{userSince.getFullYear()}</Typography>
            <Typography style={{ fontSize: '20px' }} variant="h3">Last activity: {lastActivity.getMonth() + 1}/{lastActivity.getDate()}/{lastActivity.getFullYear()}</Typography>
            <Typography style={{ fontSize: '20px' }} variant="h3">Followers: {userState.followers}</Typography>
            <FollowUserButton id={userState?._id} />
            <Tooltip title={(!user._id
                            ? 'Log in to use this feature!'
                            : user._id === userState._id ? 'You may not message yourself.' : '' )}  
            >
              <span>
                <Button
                  disabled={(user._id === userState._id) || !user._id}
                  variant="contained"
                  style={!user._id ? 
                  {
                    marginTop: '20px',
                    height: '45px',
                    width: '80px',
                    color: 'white',
                    background: 'linear-gradient(45deg, #6b6b6b 30%, #3b3b3b 90%)'
                    } :
                  {
                    marginTop: '20px',
                    height: '45px',
                    width: '80px',
                    backgroundColor: props.backgroundColor,
                  }}
                  onClick={() => setWriteMessageDialogOpen(true)}
                > 
                  send message
                </Button>
              </span>
            </Tooltip>
          </div>
        </Box>
        <Box style={{ marginLeft: '100px', width: '86%', backgroundColor: colors.tabsContainer }} boxShadow={3} borderRadius={12}>
          <AppBar position="static">
            <Tabs style={{ backgroundColor: blueGrey[900] }} variant="fullWidth" value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Created Mixtapes" />
              <Tab label="Favorite Mixtapes" />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <Box style={{ backgroundColor: blueGrey[900], width: "99%", display: "flex", flexDirection: "row" }} >
              <Box style={{
                backgroundColor: blueGrey[800],
                width: "33%",
                textAlign: "center",
                boxShadow: "3",
                borderRadius: 6
              }}>
                Name
                            </Box>
              <Box style={{
                backgroundColor: blueGrey[800],
                width: "33%",
                textAlign: "center",
                boxShadow: 3,
                borderRadius: 6
              }}>
                Collaborators
                            </Box>
              <Box style={{
                backgroundColor: blueGrey[800],
                width: "34%",
                textAlign: "center",
                boxShadow: "3",
                borderRadius: 6
              }}>
                Favorites
                            </Box>
            </Box>
            <Box style={{
              marginTop: "5px",
              backgroundColor: colors.tabsContainer
            }}>
              <MixtapeRows mixtapes={createdMixtapes} history={history} />
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Box style={{ backgroundColor: blueGrey[900], width: "99%", display: "flex", flexDirection: "row" }} >
              <Box style={{
                backgroundColor: blueGrey[800],
                width: "33%",
                textAlign: "center",
                boxShadow: "3",
                borderRadius: 6
              }}>
                Name
                            </Box>
              <Box style={{
                backgroundColor: blueGrey[800],
                width: "33%",
                textAlign: "center",
                boxShadow: 3,
                borderRadius: 6
              }}>
                Collaborators
                            </Box>
              <Box style={{
                backgroundColor: blueGrey[800],
                width: "34%",
                textAlign: "center",
                boxShadow: "3",
                borderRadius: 6
              }}>
                Favorites
                            </Box>
            </Box>
            <Box style={{
              marginTop: "5px",
              backgroundColor: colors.tabsContainer
            }}>
              <MixtapeRows mixtapes={favoritedMixtapes} history={history} />
            </Box>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
}

export default ViewUserPage;
