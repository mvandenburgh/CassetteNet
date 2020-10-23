import React from 'react';
import { Grid, Typography } from '@material-ui/core';

function AtmospherePage() {
    return (
        <div style={{ color: 'white' }}>
            <Typography align="center" variant="h2">Atmosphere Sound</Typography>
            <br />
            <Grid style={{padding: '10%'}} container spacing={3}>
                <Grid item xs>
                    <Typography align="center" variant="h4">Rainy Day</Typography>
                    <img alt="atmosphere_img"></img>
                    <Typography align="center" variant="h5">Set Audio</Typography>
                </Grid>
                <Grid item xs>
                    <Typography align="center" variant="h4">Crowded Street</Typography>
                    <img alt="atmosphere_img"></img>
                    <Typography align="center" variant="h5">Set Audio</Typography>
                </Grid>
                <Grid item xs>
                    <Typography align="center" variant="h4">Heavy Thunderstorm</Typography>
                    <img alt="atmosphere_img"></img>
                    <Typography align="center" variant="h5">Set Audio</Typography>
                </Grid>
            </Grid>
        </div>
    );
}

export default AtmospherePage;
