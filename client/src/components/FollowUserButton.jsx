import React, { useContext, useState } from 'react';
import { Button } from '@material-ui/core';
import { followUser, unfollowUser } from '../utils/api';
import UserContext from '../contexts/UserContext';

function FollowUserButton(props) {
    const { user, setUser } = useContext(UserContext);
    const [disabled, setDisabled] = useState(false);
    const followButtonHandler = async (e) => {
        setDisabled(true);
        e.stopPropagation();
        let followedUsers;
        if (user.followedUsers.map(u => u._id).includes(props.id)) {
            followedUsers = await unfollowUser(props.id);
        } else {
            followedUsers = await followUser(props.id);
        }
        const newUser = { ...user };
        newUser.followedUsers = followedUsers;
        setUser(newUser);
        setDisabled(false);
    }
    return (
        <Button
            disabled={disabled}
            variant="contained"
            boxShadow={3}
            style={{
                marginTop: '20px',
                height: '45px',
                width: '80px',
                backgroundColor: props.backgroundColor,
            }}
            onClick={followButtonHandler}
        > {user.followedUsers.map(u => u._id).includes(props.id) ? 'Unfollow' : 'Follow'} </Button>
    )
}

export default FollowUserButton;
