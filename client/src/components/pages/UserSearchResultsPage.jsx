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

    useEffect(() => {
        const page = new URLSearchParams(props.location.search).get('page');
        userSearch(new URLSearchParams(props.location.search).get('query'), page)
        .then(res => {
            setUsers(res.results);
            setTotalPages(res.totalPages);
            setTotalResults(res.totalResults);
            let currentPage;
            if (page && page <= res.totalPages) {
                currentPage = page;
            } else {
                currentPage = 1;
            }
            history.push({
                pathname: '/search/users',
                search: `?query=${new URLSearchParams(props.location.search).get('query')}&page=${currentPage}`
            });
        });
    }, [props.location.search]);

    const changePageHandler = (event, pageNumber) => {
        history.push({
            pathname: '/search/users',
            search: `?query=${new URLSearchParams(props.location.search).get('query')}&page=${pageNumber}`
        });
    }

    if (users) {
        return (
            <div style={{ width: "70%", margin: 'auto', marginTop: '4%' }}>
                <Typography style={{color: 'white'}} variant="h5">Search results for "{new URLSearchParams(props.location.search).get('query')}" ({totalResults}):</Typography>
                {totalPages > 1 ?
                    <Paper style={{display: 'inline-block'}}>
                        <Pagination count={totalPages} page={new URLSearchParams(props.location.search).get('page')} onChange={changePageHandler} />
                    </Paper>
                    : undefined
                }
                <UserList users={users} usersToExclude={props.usersToExclude} />
                {totalPages > 1 ?
                    <Paper style={{display: 'inline-block'}}>
                        <Pagination count={totalPages} page={new URLSearchParams(props.location.search).get('page')} onChange={changePageHandler} />
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
