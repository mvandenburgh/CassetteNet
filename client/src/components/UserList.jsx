import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { blueGrey, indigo, lightBlue } from '@material-ui/core/colors'
import { useHistory } from 'react-router-dom';
import ReactRoundedImage from 'react-rounded-image';
import FollowUserButton from './FollowUserButton';
import { getUserProfilePictureUrl } from '../utils/api';

function UserList({ users }) {
    const history = useHistory();
    const [highlightedRow, setHighlightedRow] = useState(null);
    const colors = {
        followedUserRowColor: blueGrey[900],
        followedUserRowMouseOverColor: blueGrey[500],
        unfollowButtonColor: lightBlue[500],
    };
    return (
        <div style={{ color: 'white', left: 0 }}>
            {users.map((user, index) => (
                <div onMouseEnter={() => setHighlightedRow(index)} onMouseLeave={() => setHighlightedRow(null)}>
                    <Box
                        style={{
                            margin: "5px",
                            padding: "10px",
                            backgroundColor: index === highlightedRow ? colors.followedUserRowMouseOverColor : colors.followedUserRowColor,
                            cursor: 'pointer',
                            display: "flex",
                            flexDirection: "row",
                            borderRadius: 6,
                            fontSize: 12,
                        }}
                        boxShadow={3}
                        onClick={() => history.push(`/user/${user._id}`)}
                    >
                        <Box style={{ width: "33%", display: 'flex', flexDirection: 'row', marginLeft: '15px' }}>
                            <ReactRoundedImage image={getUserProfilePictureUrl(user._id)} roundedSize="1" imageWidth="100" imageHeight="100" />
                            <br />
                            <Box style={{ fontSize: '15pt', width: "50%", display: 'flex', justifyContent: "left", marginLeft: '15px' }}> {user.username}#{user.uniqueId} </Box>
                        </Box>

                        <Box style={{ fontSize: '12pt', marginLeft: '50px', width: "33%", display: 'flex', flexDirection: 'column' }}>
                            Last activity: {user.updatedAt}
                            <br />
                            <br />
                  User since: {user.createdAt}
                            <br />
                            <br />
                  Followers: {user.followers}
                        </Box>
                        <Box style={{ width: "25%", display: 'flex', justifyContent: "left" }}>
                            <br />
                            <FollowUserButton id={user._id} backgroundColor={colors.unfollowButtonColor} />
                        </Box>
                    </Box>
                </div>
            ))}
        </div>
    )
}

export default UserList;
