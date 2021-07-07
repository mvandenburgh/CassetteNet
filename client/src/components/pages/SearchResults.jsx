import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, IconButton, Typography } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import MixtapeList from '../MixtapeList';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import UserContext from '../../contexts/UserContext';
import { mixtapeSearch, getMixtapeCoverImageUrl, getUserProfilePictureUrl } from '../../utils/api';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

function SearchResultsPage(props) {
    const { user } = useContext(UserContext);

    const [mixtapes, setMixtapes] = useState([]);

    useEffect(async () => {
        const searchResults = await mixtapeSearch(new URLSearchParams(props.location.search).get('query'));
        setMixtapes(searchResults);
    }, [props.location.search]);

    const history = useHistory();
    const goBack = () => history.goBack();

    const clickUserHandler = (e, userId) => {
        e.stopPropagation();
        history.push(`/user/${userId}`);
    }

    const MixtapeRows = ({ mixtapes }) => (
        <>

            {mixtapes.map(mixtape => (
                <Box
                    style={{
                        margin: "5px",
                        padding: "10px",
                        backgroundColor: blueGrey[700],
                        display: "flex",
                        flexDirection: "row",
                        borderRadius: 6,
                        fontSize: '1.5em',
                        cursor: 'pointer',
                    }}
                    onClick={() => history.push(`/mixtape/${mixtape._id}`)}
                >
                    <Grid container style={{ height: '10vh' }}>
                        <Grid item xs={1} align="left">
                            <img width={'50%'} style={{ objectFit: 'contain' }} src={getMixtapeCoverImageUrl(mixtape._id)} />
                        </Grid>
                        <Grid item xs={2} align="center">
                            {mixtape.name}
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={4} align="center" style={{ maxHeight: '100%', overflow: 'auto' }}>
                            <div style={{ borderRadius: '5px', backgroundColor: blueGrey[400] }}>
                                {mixtape.collaborators.map(c => (
                                    <Grid container style={{ cursor: 'pointer' }} onClick={(e) => clickUserHandler(e, c.user)}>
                                        <Grid item xs={2}>
                                            <img width={'50%'} style={{ objectFit: 'contain' }} src={getUserProfilePictureUrl(c.user)} />
                                        </Grid>
                                        <Grid item xs={10} align="left">
                                            {c.username}
                                        </Grid>
                                    </Grid>
                                ))}
                            </div>
                        </Grid>
                        <Grid item xs={4} align="center">
                            <FavoriteIcon />
                            <ShareIcon />
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </>
    );
    return (
        <div style={{ color: 'white', left: 0 }}>
            <IconButton color="secondary" aria-label="back" onClick={() => { goBack() }}>
                <ArrowBackIcon />
            </IconButton>
            <br />
            <br />
            <br />
            <Typography style={{ marginLeft: '100px', textAlign: "left" }} variant="h4">Search results for "{new URLSearchParams(props.location.search).get('query')}":</Typography>
            <Grid container >
                <Box style={{
                    maxHeight: '60vh',
                    overflow: 'auto',
                    display: 'inline-flex',
                    flexDirection: 'row',
                    backgroundColor: blueGrey[900],
                    marginRight: '10px',
                    marginBottom: '30px',
                    marginLeft: '100px',
                    paddingLeft: '20px',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    width: '80%',
                    height: '30%'
                }} boxShadow={3} borderRadius={12}>
                    <Box style={{
                        backgroundColor: blueGrey[900],
                        width: "33%",
                        textAlign: "center",
                        boxShadow: "3",
                        borderRadius: 6
                    }}>
                        Name
            </Box>
                    <Box style={{
                        backgroundColor: blueGrey[900],
                        width: "33%",
                        textAlign: "center",
                        boxShadow: 3,
                        borderRadius: 6
                    }}>
                        Collaborators
            </Box>
                    <Box style={{
                        backgroundColor: blueGrey[900],
                        width: "34%",
                        textAlign: "center",
                        boxShadow: "3",
                        borderRadius: 6
                    }}>
                        Favorites
            </Box>
                </Box>
                <Box style={{
                    marginLeft: "100px",
                    marginTop: '5px',
                    marginRight: '10px',
                    padding: '10px',
                    borderRadius: 6,
                    backgroundColor: blueGrey[900],
                    width: '80%'
                }}>
                    <MixtapeRows mixtapes={mixtapes} />
                </Box>
            </Grid>
        </div>
    )
}

export default SearchResultsPage;
