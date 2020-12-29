import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { getMixtapeCoverImageUrl } from '../utils/api';

function MixtapeRows({ mixtapes, history }) {
    return (
        mixtapes.map(mixtape => (
            <Box
                    style={{
                        margin: "5px",
                        padding: "10px",
                        backgroundColor: blueGrey[700],
                        display: "flex",
                        flexDirection: "row",
                        borderRadius: 6,
                        fontSize: '1.5em',
                    }}
                >
                    <Grid container>
                        <Grid item xs={1} align="left" onClick={() => history.push(`/mixtape/${mixtape._id}`)} style={{cursor: 'pointer'}}>
                            <img width={'50%'} style={{ objectFit: 'contain' }} src={getMixtapeCoverImageUrl(mixtape._id)} alt="cover_image" />
                        </Grid>
                        <Grid item xs={2} align="center" onClick={() => history.push(`/mixtape/${mixtape._id}`)} style={{cursor: 'pointer'}}>
                            {mixtape.name}
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={4} align="center" style={{ maxHeight: '100%', overflow: 'auto' }}>
                            {mixtape.collaborators.length}
                        </Grid>
                        <Grid item xs={4} align="center">
                            {mixtape.favorites}
                        </Grid>
                    </Grid>
                </Box>
        ))
    )
}

export default MixtapeRows;
