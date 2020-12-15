import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { followUser, unfollowUser } from '../utils/api';
import Tooltip from '@material-ui/core/Tooltip';
import UserContext from '../contexts/UserContext';

function FollowUserButton(props) {
    const { user, setUser } = useContext(UserContext);
    const [disabled, setDisabled] = useState(props.disabled);
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
        if(followedUsers) {
            newUser.followedUsers = followedUsers;
        }
        else {
            newUser.followedUsers = [];
        }
        
        setUser(newUser);
        setDisabled(false);
    }
    return (
        
        <Tooltip title={(!user._id
                            ? 'Log in to use this feature!'
                            : user._id == props.id ? 'You may not follow yourself.' : '' )} >
            <span>
                <Button
                    disabled={(!user._id|| disabled || user._id == props.id)}
                    variant="contained"
                    boxShadow={3}
                    style={!user.followedUsers ? {
                        marginTop: '20px',
                        height: '45px',
                        width: '80px',
                        color: 'white',
                        background: 'linear-gradient(45deg, #6b6b6b 30%, #3b3b3b 90%)'
                    } : 
                    {
                        marginTop: '20px',
                        height: '45px',
                        width: '80px',
                        backgroundColor: props.backgroundColor,
                    }}
                    onClick={followButtonHandler}
                > 
                    {user.followedUsers ? (user.followedUsers?.map(u => u._id).includes(props.id) ? 'Unfollow' : 'Follow') : 'follow'} 
                </Button>
            </span>
            </Tooltip>
    )
}

export default FollowUserButton;
