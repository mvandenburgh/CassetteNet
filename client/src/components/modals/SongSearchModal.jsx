import React, { useEffect, useState } from 'react';
import { Backdrop, Box, Modal, Fade, Grid, Typography, Button, CircularProgress, NativeSelect, MenuItem, withStyles, InputBase } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import SearchBar from 'material-ui-search-bar';
import { songSearch } from '../../utils/api';

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const Results = ({ results, addSongs, songsToAdd, setSongsToAdd }) => {
    const [added, setAdded] = useState({});


    const addSongHandler = (song) => {
        const newAdded = { ...added };
        newAdded[song.id] = true;
        setAdded(newAdded);
        setSongsToAdd([song, ...songsToAdd]);
    }

    return (
        <>
            {results?.map((result, i) => (
                <Box
                    style={{
                        margin: "5px",
                        padding: "10px",
                        backgroundColor: blueGrey[700],
                        display: "flex",
                        flexDirection: "row",
                        borderRadius: 6,
                        color: 'white',
                        fontSize: '1em',
                    }}
                    key={i}
                >
                    <Grid container>
                        <Grid item xs={1} align="left" style={{ cursor: 'pointer' }}>
                            <img width="100%" style={{ objectFit: 'contain' }} src={result.coverImage} />
                        </Grid>
                        <Grid item xs={10} align="center">
                            {result.name}
                        </Grid>
                        <Grid item xs={1}>
                            {!added[result.id] ?
                                <AddIcon onClick={() => addSongHandler(result)} />
                                : <span>Added!</span>}
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </>
    )
};

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

function SongSearchModal({ open, setOpen, addSongs, mixtape }) {
    const classes = useStyles();

    const [results, setResults] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const [songsToAdd, setSongsToAdd] = useState([]);

    const [api, setApi] = useState('youtube');

    const handleSearch = () => {
        setResults(null);
        if (!searchQuery) {
            return;
        }
        setLoading(true);
        songSearch(api, searchQuery).then(res => {
            setResults({ 1: res });
            setLoading(false);
        });
    }

    const handleChangePage = (e, page) => {
        setLoading(true);
        if (results[page]) {
            setCurrentPage(page);
            setLoading(false);
        } else {
            songSearch(api, searchQuery, page).then(res => {
                const newResults = { ...results }
                newResults[page] = res;
                setResults(newResults);
                console.log(page);
                console.log(currentPage)
                setCurrentPage(page);
                setLoading(false);
            });
        }
    }

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }

    const handleClose = () => {
        addSongs(songsToAdd);
        setOpen(false);
        setSongsToAdd([]);
    }

    return (
        <Modal
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid container justify="center" alignItems="center" style={{ backgroundColor: blueGrey[400], height: '85%', width: '60%' }}>
                    <Grid item xs={12}>
                        <Typography align="center" variant="h3">Add a song</Typography>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={7}>
                        <SearchBar
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onRequestSearch={handleSearch}
                            cancelOnEscape={false}
                        />
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={2}>
                        <NativeSelect
                            style={{ height: '100%', top: '0px' }}
                            variant="filled"
                            value={api}
                            onChange={(e) => setApi(e.target.value)}
                            input={<BootstrapInput />}
                        >
                            <option value="" />
                            <option value={'youtube'}>YouTube</option>
                            <option value={'soundcloud'}>SoundCloud</option>
                        </NativeSelect>
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10} justify="center" style={{ overflow: 'auto', height: '60%' }}>
                        {
                            !loading ?
                                <Results results={results ? results[currentPage] : []} addSongs={addSongs} songsToAdd={songsToAdd} setSongsToAdd={setSongsToAdd} />
                                :
                                <CircularProgress />
                        }
                    </Grid>
                    <Grid item xs={1} />
                    {
                        api === 'youtube' ?
                            <Pagination count={results ? results[currentPage].length === 0 ? Object.keys(results).length : Object.keys(results).length + 1 : 1} disabled={loading || !results} page={currentPage} onChange={handleChangePage} />
                            : undefined
                    }
                </Grid>
            </Fade>
        </Modal >
    )
}

export default SongSearchModal;
