import React from 'react';
import { Typography } from '@material-ui/core';
import HidePageFrameContext from '../../contexts/HidePageFrameContext';
import NavigateContext from '../../contexts/NavigateContext.js';


function NotFoundPage() {
    return (
        <div style={{ color: 'white' }}>
            <Typography align="center" variant="h2">Page Not Found</Typography>
            <br />
            <Typography align="center" variant="h5">
                The content you are trying to access is not available at this time!
            </Typography>
        </div>
    );
}

export default NotFoundPage;
