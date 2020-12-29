import React, { useEffect, useState } from 'react';
import { Box, Grid, IconButton, Paper, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { blueGrey } from '@material-ui/core/colors';
import ShareIcon from '@material-ui/icons/Share';
import { mixtapeSearch, getMixtapeCoverImageUrl, getUserProfilePictureUrl } from '../../utils/api';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import FavoriteMixtapeButton from '../FavoriteMixtapeButton';
import ShareMixtapeModal from '../modals/ShareMixtapeModal';

function MixtapeSearchResultsPage(props) {
    const [mixtapes, setMixtapes] = useState([]);

    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [mixtapeToShare, setMixtapeToShare] = useState(null);

    const [shareModalOpen, setShareModalOpen] = useState(false);

    const history = useHistory();
    const goBack = () => history.goBack();

    useEffect(() => {
        mixtapeSearch(new URLSearchParams(props.location.search).get('query'), currentPage)
        .then(res => {
            setMixtapes(res.results);
            setTotalPages(res.totalPages);
            setTotalResults(res.totalResults);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, new URLSearchParams(props.location.search).get('query')]);


    const clickUserHandler = (e, userId) => {
        e.stopPropagation();
        history.push(`/user/${userId}`);
    }

    const shareMixtapeHandler = (mixtape) => {
        setMixtapeToShare(mixtape);
        setShareModalOpen(true);
    }

    const changePageHandler = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                        fontSize: '1em',
                    }}
                >
                    <Grid container style={{ height: '10vh' }}>
                        <Grid item xs={1} align="left" onClick={() => history.push(`/mixtape/${mixtape._id}`)} style={{cursor: 'pointer'}}>
                            <img width={'50%'} style={{ objectFit: 'contain' }} src={getMixtapeCoverImageUrl(mixtape._id)} alt="cover_image" />
                        </Grid>
                        <Grid item xs={2} align="center" onClick={() => history.push(`/mixtape/${mixtape._id}`)} style={{cursor: 'pointer'}}>
                            {mixtape.name}
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={4} align="center" style={{ maxHeight: '100%', overflow: 'auto' }}>
                            <div style={{ borderRadius: '5px', backgroundColor: blueGrey[400] }}>
                                {mixtape.collaborators.map(c => (
                                    <Grid container style={{ cursor: 'pointer' }} onClick={(e) => clickUserHandler(e, c.user)}>
                                        <Grid item xs={2}>
                                            <img width={'50%'} style={{ objectFit: 'contain' }} src={getUserProfilePictureUrl(c.user)} alt="pfp" />
                                        </Grid>
                                        <Grid item xs={10} align="left">
                                            {c.username}
                                        </Grid>
                                    </Grid>
                                ))}
                            </div>
                        </Grid>
                        <Grid item xs={4} align="center">
                            <FavoriteMixtapeButton id={mixtape._id} />
                            <ShareIcon style={{cursor: 'pointer'}}  onClick={() => shareMixtapeHandler(mixtape)} />
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </>
    );
    return (
        <div style={{ color: 'white', left: 0 }}>
            <IconButton color="secondary" aria-label="back" onClick={() => goBack()}>
                <ArrowBackIcon />
            </IconButton>
            <ShareMixtapeModal open={shareModalOpen} setOpen={setShareModalOpen} mixtape={mixtapeToShare} />
            <br />
            <br />
            <br />
            <Typography style={{ marginLeft: '100px', textAlign: "left" }} variant="h4">Search results for "{new URLSearchParams(props.location.search).get('query')}" ({totalResults}):</Typography>
            <Grid container >
                <Box style={{
                    maxHeight: '60vh',
                    overflow: 'auto',
                    display: 'inline-flex',
                    flexDirection: 'row',
                    backgroundColor: blueGrey[900],
                    marginTop: '2%',
                    marginLeft: '10%',
                    marginRight: '10%',
                    paddingLeft: '20px',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    width: '90%',
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
                    marginLeft: "10%",
                    marginTop: '2%',
                    marginRight: '10%',
                    marginBottom: '10%',
                    padding: '10px',
                    borderRadius: 6,
                    backgroundColor: blueGrey[900],
                    width: '90%',
                }}>
                    <MixtapeRows mixtapes={mixtapes} />
                    {totalPages > 1 ?
                        <Paper style={{display: 'inline-block'}}>
                            <Pagination count={totalPages} page={new URLSearchParams(props.location.search).get('page')} onChange={changePageHandler} />
                        </Paper>
                        : undefined
                    }
                </Box>
            </Grid>
        </div>
    )
}

export default MixtapeSearchResultsPage;
