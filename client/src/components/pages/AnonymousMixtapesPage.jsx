import React, { useContext, useState } from 'react';
import { AppBar, Box, Button, Grid, Tab, Tabs, Typography, makeStyles, IconButton } from '@material-ui/core';
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
            <Box style={{ width: "33%", display: 'flex', justifyContent: "center"}}> Some buttons </Box>

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
        {/* <Box style={{ 
                backgroundColor: blueGrey[900],
                margin: 'auto',
                padding: 'auto',
                height: '80%',
                width: '80%'
            }}>
                inside
        </Box> */}

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
            <Box style={{
                            marginTop: "5px",
                            backgroundColor: blueGrey[900]
                        }}> 
                            <MixtapeRows mixtapes={anonMixtapes} />
                        </Box>
        </Box>
      </div>
);
}

export default AnonymousMixtapesPage;