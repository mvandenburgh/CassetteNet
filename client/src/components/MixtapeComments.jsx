import React, { useState } from 'react';
import Avatar from '@atlaskit/avatar';
import Comment, { CommentAuthor, CommentTime } from '@atlaskit/comment';
import TextArea from '@atlaskit/textarea';
import { Button, Grid, Paper } from '@material-ui/core';
import dateFormat from 'dateformat';
import { commentOnMixtape, getUserProfilePictureUrl } from '../utils/api';

function MixtapeComments({ mixtape, setMixtape }) {
    const [comment, setComment] = useState('');

    const postComment = () => {
        commentOnMixtape(mixtape._id, comment)
            .then(newComments => {
                const newMixtape = { ...mixtape };
                newMixtape.comments = newComments;
                setMixtape(newMixtape);
                setComment('');
            });
    }
    return (
        <div>
            <Grid container>
                <Grid item xs={11}>
                    <TextArea
                        resize="smart"
                        placeholder="Type your comment here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Button onClick={postComment} variant="contained" style={{ height: '100%', width: '100%' }}>POST COMMENT</Button>
                </Grid>
            </Grid>
            {mixtape?.comments?.map(comment => (
                <Paper>
                    <Comment
                        avatar={<Avatar src={getUserProfilePictureUrl(comment.author.user)} size="medium" />}
                        author={<CommentAuthor href={`/user/${comment.author.user}`}>{comment.author.username}</CommentAuthor>}
                        content={<p>{comment.comment}</p>}
                        time={<CommentTime>{dateFormat(comment.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</CommentTime>}
                    >
                    </Comment>
                </Paper>
            ))}
        </div>
    );
}

export default MixtapeComments;
