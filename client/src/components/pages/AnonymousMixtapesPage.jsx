import React, { useContext, useState } from 'react';
import { AppBar, Box, Button, Grid, Tab, Tabs, Typography, makeStyles, IconButton } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import indigo from '@material-ui/core/colors/indigo';
import blueGrey from '@material-ui/core/colors/blueGrey';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { users } from '../../testData/users.json'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';


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
            <Box style={{ width: "33%", display: 'flex', flexDirection: "row", justifyContent: "center"}}> 
                <FavoriteIcon/> 
                <CommentIcon/> 
                <ShareIcon/> 
            </Box>

        </Box>
      ))}
    </>
    ); 

function AnonymousMixtapesPage(props) {
  const colors = {

  }

  var anonMixtapes = [
    {
        name: 'Evening Acoustic',
        collaborators: 'purplefish313, brownmeercat530',
    },
    {
        name: 'Rock Classics',
        collaborators: 'silverbutterfly863, brownmeercat530',
    },
    {
        name: 'Gold School',
        collaborators: 'yellowleopard776',
    },
    {
        name: 'Calm Down',
        collaborators: 'goldengoose181, brownmeercat530',
    },
    {
        name: 'Chill + Atmospheric',
        collaborators: 'beautifulpanda667',
    },  
    ];


  const history = useHistory();
  const goBack = () => { history.push('/') }

  return (
      <div  style={{ color: 'white', left:0 }}>

        <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
            <ArrowBackIcon/>
        </IconButton>
        <br/>
        <Typography variant="h3" style={{textAlign: "center"}}>Mixtapes Anonymous</Typography>
        <br/>
        <Grid container direction="row">
        <Grid sz={1}>
        </Grid>
        <Box style={{backgroundColor: blueGrey[900], marginLeft:"170px",width: "80%", display: "flex", flexDirection: "row", borderRadius: 3, padding: '5px' }} >
            <Box style={{ backgroundColor: blueGrey[900],
                            width: "33%",
                            textAlign: "center",
                            boxShadow: "3",
                            borderRadius: 6
                        }}>
                Name
            </Box>
            <Box style={{ backgroundColor: blueGrey[900],
                            width: "33%",
                            textAlign: "center",
                            boxShadow: 3,
                            borderRadius: 6
                        }}>
                Collaborators
            </Box>
            <Box style={{ backgroundColor: blueGrey[900],
                            width: "34%",
                            textAlign: "center",
                            boxShadow: "3",
                            borderRadius: 6
                        }}>
                Favorite-Comment-Share
            </Box>
        </Box>
        <Box style={{
                        marginLeft:"170px",
                        marginTop: '5px',
                        marginRight: '10px',
                        padding: '5px',
                        borderRadius: 6,
                        backgroundColor: blueGrey[900],
                        width: '80%'
                    }}> 
                <MixtapeRows mixtapes={anonMixtapes} />
            </Box>
        </Grid>
        
        
      </div>
);
}

export default AnonymousMixtapesPage;