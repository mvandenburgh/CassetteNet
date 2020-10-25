import React from 'react';
import { Card, CardContent, CardMedia, IconButton, Grid, Typography, makeStyles, useTheme } from '@material-ui/core';
import { SkipNext as SkipNextIcon, SkipPrevious as SkipPreviousIcon, PlayArrow as PlayArrowIcon } from '@material-ui/icons';

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

function AtmospherePage() {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <div style={{ color: 'white' }}>
            <Typography align="center" variant="h2">Atmosphere Sound</Typography>
            <br />
            <Grid style={{padding: '10%'}} container spacing={3}>
                {[{title: 'Rainy Day', url: 'https://media2.vault.com/21223/rainy_window.jpg' }, {title: 'Crowded Street', url: 'https://www.hassemanmarketing.com/wp-content/uploads/2019/03/8bcdf2_489f56623e714d2bbe6b9471db6070b0-mv2.jpg' }, {title: 'Heavy Thunderstorm', url: 'https://kstp.com/kstpImages/repository/2020-06/800LightningThunderstormGenericGfx-MGN.jpg' }].map((item => {
                    return (<Grid item xs>
                        <Card className={classes.root}>
                            <div className={classes.details}>
                                <CardContent className={classes.content}>
                                    <Typography component="h5" variant="h5">
                                        {item.title}
                                    </Typography>
                                </CardContent>
                                <div className={classes.controls}>
                                <IconButton aria-label="previous">
                                    {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                                </IconButton>
                                <IconButton aria-label="play/pause">
                                    <PlayArrowIcon className={classes.playIcon} />
                                </IconButton>
                                <IconButton aria-label="next">
                                    {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                                </IconButton>
                                </div>
                            </div>
                            <CardMedia
                                className={classes.cover}
                                image={item.url}
                                title="Rainy Day"
                            />
                        </Card>
                    </Grid>);
                }))}
            </Grid>
        </div>
    );
}

export default AtmospherePage;
