import React, { useContext, useState } from 'react';
import { Button } from '@material-ui/core';
import { followUser, unfollowUser } from '../utils/api';
import Tooltip from '@material-ui/core/Tooltip';
import UserContext from '../contexts/UserContext';
import guest_disabled from '../images/guest_disabled.png'

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
        <Tooltip title="You may not follow yourself"  
        disableHoverListener={user.isGuest ? null : !(props.id == user?._id)}
        >
            <span>
                <Button
                    disabled={user.isGuest ? null : (disabled || user._id == props.id)}
                    variant="contained"
                    boxShadow={3}
                    style={user.isGuest ? {
                         marginTop: '20px',
                        height: '45px',
                        width: '80px',
                        //backgroundImage: guest_disabled
                        backgroundColor: 'pink'
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
