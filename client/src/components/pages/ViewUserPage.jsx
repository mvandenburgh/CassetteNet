import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Box, Button, Grid, Tab, Tabs, Typography, makeStyles, IconButton } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { getUser, getUserProfilePictureUrl } from '../../utils/api';
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

var favorites = [
  {
    name: 'Evening Acoustic',
    collaborators: 'purplefish313, brownmeercat530',
    favorites: 106
  },
  {
    name: 'Rock Classics',
    collaborators: 'silverbutterfly863, brownmeercat530',
    favorites: 93,
  },
];

var theirMixtapes = [
  {
    name: 'Calm Vibes',
    collaborators: 'biglion179',
    favorites: 15
  },
  {
    name: 'Acoustic Soul',
    collaborators: 'lazykoala317, tinygoose218',
    favorites: 48,
  },
];

const MixtapeRows = ({ mixtapes }) => (
  <>
    {mixtapes.map(mixtape => (
      <Box style={{
        margin: "5px",
        padding: "10px",
        backgroundColor: blueGrey[700],
        display: "flex",
        flexDirection: "row",
        borderRadius: 6,
        fontSize: 12,
      }}>
        <Box style={{ width: "33%", display: 'flex', justifyContent: "center" }}> {mixtape.name} </Box>
        <Box style={{ width: "33%", display: 'flex', justifyContent: "center" }}> {mixtape.collaborators} </Box>
        <Box style={{ width: "33%", display: 'flex', justifyContent: "center" }}> {mixtape.favorites} </Box>

      </Box>
    ))}
  </>
);

//var favorites = users[1].favoritedMixtapes;



function ViewUserPage(props) {
  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    TextStyle: {
      color: "white",
    }
  }));

  const classes = useStyles();

  const colors = {
    namePfpContainer: blueGrey[900],
    tabsContainer: blueGrey[900],
    mixtapeRowColor: blueGrey[800]
  }

  const { id } = props.match.params;

  const [user, setUser] = useState({});

  useEffect(() => {
    async function getUserInfo() {
        if (id) {
          const userInfo = await getUser(id);
          setUser(userInfo);
        }
    }
    getUserInfo();
  }, []);

  const history = useHistory();
  const goBack = () => history.goBack();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ color: 'white', left: 0 }}>
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
          <ReactRoundedImage image={getUserProfilePictureUrl(user?._id)} roundedSize="1" imageWidth="300" imageHeight="300" />
          <div style={{ display: 'inline-flex', flexDirection: 'column', paddingLeft: '30px', }}>
            <span style={{ display: 'inline-flex', flexDirection: 'row', paddingTop: '30px', paddingBottom: '30px', height: '25%', }}>
              <Typography style={{ fontSize: '40px' }} variant="h3">{user.username}</Typography>
              <Typography style={{ fontSize: '20px' }} variant="h3">{`#${user.uniqueId}`}</Typography>
            </span>
            <Typography style={{ fontSize: '20px' }} variant="h3">User since: 9/22/20</Typography>
            <Typography style={{ fontSize: '20px' }} variant="h3">Last seen: 10/29/20</Typography>
            <Typography style={{ fontSize: '20px' }} variant="h3">Followers: 203</Typography>
            <Button variant="outlined" style={{ padding: '10px', marginTop: '10px', height: '40px', width: '20px', backgroundColor: blueGrey[600], color: 'white' }}>Follow</Button>
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
              <MixtapeRows mixtapes={theirMixtapes} />
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
              <MixtapeRows mixtapes={favorites} />
            </Box>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
}

export default ViewUserPage;
