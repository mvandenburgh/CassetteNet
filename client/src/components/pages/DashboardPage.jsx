import React, { useContext } from 'react';
import { Button, Grid, IconButton, Card, Box, Typography } from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { DataGrid } from '@material-ui/data-grid';
import logo from '../../images/logo.png';
import { makeStyles } from "@material-ui/core/styles";
import UserContext from '../../contexts/UserContext';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

function DashboardPage(props) {
    var popularMixtapes = [
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

    var userActivities = [
        "DrizzyD favorited a mixtape: summertime",
        "bob created a new mixtape: bob's hits"
    ];

    const colors = {
        namePfpContainer: blueGrey[900],
        tabsContainer: blueGrey[900],
        mixtapeRowColor: blueGrey[800]
    }

    const MixtapeRows = ({mixtapes}) => (
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
                <Box style={{ width: "33%", display: 'flex', justifyContent: "center"}}> {mixtape.name} </Box>
                <Box style={{ width: "33%", display: 'flex', justifyContent: "center"}}> {mixtape.collaborators} </Box>
                <Box style={{ width: "33%", display: 'flex', justifyContent: "center"}}> {mixtape.favorites} </Box>
    
            </Box>
          ))}
        </>
        ); 

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
                <Box style={{backgroundColor: blueGrey[900], width: "99%", display: "flex", flexDirection: "row"}} >
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
                </Box>
                <Box style={{
                        marginTop: "5px",
                        backgroundColor: colors.tabsContainer
                        }}> 
                    <MixtapeRows mixtapes={popularMixtapes} />
                </Box>
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
