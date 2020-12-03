import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import UserList from '../UserList';
import { userSearch } from '../../utils/api';

function UserSearchResults(props) {
    const history = useHistory();

    const [users, setUsers] = useState(null);
    const [currentPage, setCurrentPage] = useState(new URLSearchParams(props.location.search).get('page') || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        userSearch(new URLSearchParams(props.location.search).get('query'), currentPage)
        .then(res => {
            setUsers(res.results);
            setCurrentPage(res.currentPage);
            setTotalPages(res.totalPages);
            setTotalResults(res.totalResults);
            history.push({
                pathname: '/search/users',
                search: `?query=${new URLSearchParams(props.location.search).get('query')}&page=${res.currentPage}`
            });
        });
    }, [props.location.search, currentPage]);

    const changePageHandler = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    }

    if (users) {
        return (
            <div style={{ width: "70%", margin: 'auto', marginTop: '4%' }}>
                <Typography style={{color: 'white'}} variant="h5">Search results for "{new URLSearchParams(props.location.search).get('query')}" ({totalResults}):</Typography>
                {totalPages > 1 ?
                    <Paper style={{display: 'inline-block'}}>
                        <Pagination count={totalPages} page={currentPage} onChange={changePageHandler} />
                    </Paper>
                    : undefined
                }
                <UserList users={users} />
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
