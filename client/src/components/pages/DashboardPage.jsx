import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid, IconButton, Card, Box, Typography } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import FavoriteMixtapeButton from '../FavoriteMixtapeButton';
import MixtapeList from '../MixtapeList';
import { DataGrid } from '@material-ui/data-grid';
import logo from '../../images/logo.png';
import { makeStyles } from "@material-ui/core/styles";
import UserContext from '../../contexts/UserContext';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { getPopularMixtapes, getRandomMixtapes } from '../../utils/api';
import { useHistory } from 'react-router-dom';
const MixtapeRows = ({ mixtapes, history }) => (
    <>
  
      {mixtapes?.map(mixtape => (
        <Box
          style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: blueGrey[700],
            display: "flex",
            flexDirection: "row",
            borderRadius: 6,
            fontSize: 12,
          }}
        >
          <Box style={{ width: "33%", display: 'flex', justifyContent: "center", cursor: 'pointer' }} onClick={() => history.push(`/mixtape/${mixtape._id}`)}> {mixtape.name} </Box>
          <Box style={{ width: "33%", display: 'flex', justifyContent: "center", cursor: 'pointer' }} onClick={() => history.push(`/user/${mixtape.collaborators?.filter(c => c.permissions === 'owner')[0]?.user}`)}> {mixtape.collaborators.filter(c => c?.permissions === 'owner')[0]?.username} </Box>
          <Box style={{ width: "33%", display: 'flex', flexDirection: "row", justifyContent: "center" }}>
            <FavoriteMixtapeButton id={mixtape._id} />
            {/* <CommentIcon /> */}
            {/* <ShareIcon /> */}
          </Box>
        </Box>
      ))}
    </>
  );

function DashboardPage(props) {

    var userActivities = [
        "DrizzyD favorited a mixtape: summertime",
        "bob created a new mixtape: bob's hits"
    ];

    const colors = {
        namePfpContainer: blueGrey[900],
        tabsContainer: blueGrey[900],
        mixtapeRowColor: blueGrey[800]
    }

    const ActivityRows = ({activities}) => (
      <>
      {activities.map(activity => (
        <Box style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: blueGrey[700],
            display: "flex", 
            flexDirection: "row",
            borderRadius: 6,
            fontSize: 12,
        }}>
            <Box style={{ display: 'flex', justifyContent: "center"}}> {activity} </Box>
        </Box>
      ))}
    </>
    ); 

    const history = useHistory();
    const [mixtapes, setMixtapes] = useState([]);

  useEffect(() => {
    getRandomMixtapes(10, 'daily').then(mixtapes => setMixtapes(mixtapes));
  }, []);

    const goBack = () => { history.push('/') }

    const [value, setValue] = React.useState(0);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        return;
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };



    console.log(mixtapes);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
        <div  style={{ color: 'white', left:0 }}>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
            <Box style={{ 
                    backgroundColor: blueGrey[900],
                    //marginRight: '50px',
                    margin: 'auto',
                    padding: '10px',
                    textAlign: "center",
                    borderRadius: 6,
                    boxShadow: 6,
                    width: '80%'
                }}> 
                <Typography variant="h3"> Popular Mixtapes This Week</Typography>
                <br/>
                {/* <Box style={{backgroundColor: blueGrey[900], width: "99%", display: "flex", flexDirection: "row"}} >
                    <Box style={{ backgroundColor: blueGrey[800],
                                width: "33%",
                                textAlign: "center",
                                boxShadow: "3",
                                borderRadius: 6
                                }}>
                        Name
                    </Box>
                    <Box style={{ backgroundColor: blueGrey[800],
                                width: "33%",
                                textAlign: "center",
                                boxShadow: 3,
                                borderRadius: 6
                                }}>
                        Collaborators
                    </Box>
                    <Box style={{ backgroundColor: blueGrey[800],
                                width: "34%",
                                textAlign: "center",
                                boxShadow: "3",
                                borderRadius: 6
                                }}>
                        Favorites
                    </Box>
                </Box> */}
                <Box onClick={handleClickOpen} style={{
                        marginLeft: "170px",
                        marginTop: '5px',
                        marginRight: '10px',
                        padding: '5px',
                        borderRadius: 6,
                        backgroundColor: blueGrey[900],
                        width: '80%'
                    }}> 
                    <MixtapeRows mixtapes={mixtapes} history={history} />
                </Box>
                {/* <Box style={{
                            maxHeight: '60vh',
                            overflow: 'auto',
                            display: 'inline-flex', 
                            flexDirection: 'row', 
                            backgroundColor: blueGrey[900], 
                            marginRight: '10px',
                            marginBottom: '30px',
                            paddingLeft: '20px',
                            paddingTop: '20px',  
                            paddingBottom: '20px',
                            width: '85%', 
                            height: '30%'}} boxShadow={3} borderRadius={12}>
                    <Grid container justify="center">
                        <MixtapeRows mixtapes={mixtapes} setMixtapes={setMixtapes} />
                    </Grid>
                </Box> */}
            </Box>

            <br/>
            <Box style={{ 
                    backgroundColor: blueGrey[900],
                    margin: 'auto',
                    padding: '10px',
                    textAlign: "center",
                    borderRadius: 6,
                    boxShadow: 6,
                    width: '80%'
                    }}> 
                <Typography variant="h3">Followed User Activity</Typography>
                <br/>
                <Box style={{
                        marginTop: "5px",
                        backgroundColor: colors.tabsContainer,
                        }}> 
                    <ActivityRows activities={userActivities} />
                </Box>
            </Box>
        </div>
    );
}

export default DashboardPage;
