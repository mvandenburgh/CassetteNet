import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, IconButton, Typography } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import MixtapeList from '../MixtapeList';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import UserContext from '../../contexts/UserContext';
import { getFavoritedMixtapes } from '../../utils/api';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import mixtapes from '../../testData/mixtapes.json';

function SearchResultsPage(props) {
    let { user, setUser } = useContext(UserContext);
    if (!user.isLoggedIn) {
        user = JSON.parse(localStorage.getItem('user'));
    }
    const { _id } = user;
    //const mixtapes = getFavoritedMixtapes(_id);

    const history = useHistory();
    const goBack = () => { history.push('/') }

    var anonMixtapes = [
        {
            name: 'Justin Beiber top Hits',
            collaborators: 'purplefish313, brownmeercat530',
        },
        {
            name: 'Best of Bieber',
            collaborators: 'silverbutterfly863, brownmeercat530',
        },
        {
            name: 'Bieber fever',
            collaborators: 'yellowleopard776',
        },
        {
            name: 'Justin Biebers greatest hits',
            collaborators: 'goldengoose181, brownmeercat530',
        },
        {
            name: 'Bieber',
            collaborators: 'beautifulpanda667',
        },  
        ];
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
                <ShareIcon/> 
                </Box>
    
            </Box>
          ))}
        </>
        ); 
    return (
        <div style={{ color: 'white', left:0 }}>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
                
            <br/>
            <br/>
            <Typography style={{marginLeft:'100px',textAlign: "left"}} variant="h4">Search results for "Justin Bieber":</Typography>
            <Grid container >
                <Box style={{
                            maxHeight: '60vh',
                            overflow: 'auto',
                            display: 'inline-flex', 
                            flexDirection: 'row', 
                            backgroundColor: blueGrey[900], 
                            marginRight: '10px',
                            marginBottom: '30px',
                            marginLeft:'100px',
                            paddingLeft: '20px',
                            paddingTop: '20px',  
                            paddingBottom: '20px',
                            width: '80%', 
                            height: '30%'}} boxShadow={3} borderRadius={12}>
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
                Favorites
            </Box>
                </Box>
                <Box style={{
                        marginLeft:"100px",
                        marginTop: '5px',
                        marginRight: '10px',
                        padding: '10px',
                        borderRadius: 6,
                        backgroundColor: blueGrey[900],
                        width: '80%'
                    }}> 
                <MixtapeRows mixtapes={anonMixtapes} />
            </Box>
            </Grid>
        </div>
    )
}

export default SearchResultsPage;
