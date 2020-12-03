import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import UserList from '../UserList';
import { userSearch } from '../../utils/api';

function UserSearchResults(props) {
    const [users, setUsers] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        console.log('sjdiof')
        userSearch(new URLSearchParams(props.location.search).get('query'), currentPage)
        .then(res => {
            setUsers(res.results);
            setCurrentPage(res.currentPage);
            setTotalPages(res.totalPages);
            setTotalResults(res.totalResults);
        });
    }, [props.location.search, currentPage]);

    const changePageHandler = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    }

    if (users) {
        return (
            <div style={{ width: "70%", margin: 'auto', marginTop: '4%' }}>
                <Typography style={{color: 'white'}} variant="h5">Search results for "{new URLSearchParams(props.location.search).get('query')}" ({totalResults}):</Typography>
                <Paper style={{display: 'inline-block'}}>
                    <Pagination count={totalPages} page={currentPage} onChange={changePageHandler} />
                </Paper>
                <UserList users={users} />
                <Paper style={{display: 'inline-block'}}>
                    <Pagination count={totalPages} page={currentPage} onChange={changePageHandler} />
                </Paper>
            </div>
        );
    }

    else {
        return null;
    }
    
}

export default UserSearchResults;
