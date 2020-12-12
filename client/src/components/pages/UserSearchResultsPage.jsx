import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import UserList from '../UserList';
import { userSearch } from '../../utils/api';

function UserSearchResults(props) {
    const history = useHistory();

    const [users, setUsers] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        userSearch(new URLSearchParams(props.location.search).get('query'), currentPage)
        .then(res => {
            setUsers(res.results);
            setTotalPages(res.totalPages);
            setTotalResults(res.totalResults);
        });
    }, [currentPage]);

    const changePageHandler = (event, pageNumber) => {
        setCurrentPage(pageNumber)
    }

    if (users) {
        return (
            <div style={{ width: "70%", margin: 'auto', marginTop: '4%', marginBottom: '10%' }}>
                <Typography style={{color: 'white'}} variant="h5">Search results for "{new URLSearchParams(props.location.search).get('query')}" ({totalResults}):</Typography>
                <UserList users={users} usersToExclude={props.usersToExclude} />
                {totalPages > 1 ?
                    <Paper style={{display: 'inline-block'}}>
                        <Pagination count={totalPages} page={currentPage} onChange={changePageHandler} />
                    </Paper>
                    : undefined
                }
            </div>
        );
    }

    else {
        return null;
    }
    
}

export default UserSearchResults;
