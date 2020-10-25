import React from 'react';
import { Typography, makeStyles, useTheme } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

function NotFoundPage() {
    const classes = useStyles();
    const theme = useTheme();
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
