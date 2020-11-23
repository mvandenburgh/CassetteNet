import React, { useContext, useEffect, useState } from 'react';
import UserList from '../UserList';
import { userSearch } from '../../utils/api';
import UserContext from '../../contexts/UserContext';

function UserSearchResults(props) {
    const { user } = useContext(UserContext);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        userSearch(new URLSearchParams(props.location.search).get('query'))
        .then(res => setUsers(res));
    }, [props.location.search]);

    if (users) {
        return (
            <div style={{ width: "70%", margin: 'auto' }}>
                <UserList users={users} />
            </div>
        )
    }

    else {
        return null;
    }
    
}

export default UserSearchResults;
