import React from 'react';
import { Typography, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';


function NotFoundPage() {
    const history = useHistory();
    const goBack = () => { history.push('/') }

    return (
        <div style={{ color: 'white', left:0}}>
            <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
                <ArrowBackIcon/>
            </IconButton>
            <br/>
                
            <br/>
            <br/>
            <Typography align="center" variant="h2">Page Not Found</Typography>
            <br />
            <Typography align="center" variant="h5">
                The content you are trying to access is not available at this time!
            </Typography>
        </div>
    );
}

export default NotFoundPage;
