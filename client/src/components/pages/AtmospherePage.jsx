import React, { useContext } from 'react';
import { Card, CardContent, CardMedia, IconButton, Grid, Typography, makeStyles, useTheme } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon, SkipNext as SkipNextIcon, SkipPrevious as SkipPreviousIcon, PlayArrow as PlayArrowIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import AtmosphereSoundContext from '../../contexts/AtmosphereSoundContext';


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

    const history = useHistory();
    const goBack = () => history.goBack();

    const { setAtmosphereSound } = useContext(AtmosphereSoundContext);

    const sounds = [
      { title: 'Rainy Day', filename: '/atmosphere/rain.wav', img: '/atmosphere/rainy_window.png' },
    ];

    return (
        <div style={{ color: 'white', left:0}}>
          <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
            <ArrowBackIcon/>
          </IconButton>
            <Typography align="center" variant="h2">Atmosphere Sound</Typography>
            <br />
            <Grid style={{padding: '10%'}} container spacing={3}>
                {sounds.map((item => {
                    return (<Grid item xs>
                        <Card className={classes.root}>
                            <div className={classes.details}>
                                <CardContent className={classes.content}>
                                    <Typography component="h5" variant="h5">
                                        {item.title}
                                    </Typography>
                                </CardContent>
                                <div className={classes.controls}>
                                <IconButton>
                                    <PlayArrowIcon
                                      className={classes.playIcon}
                                      onClick={() => setAtmosphereSound({ isPlaying: true, filename: item.filename })}  
                                    />
                                </IconButton>
                                </div>
                            </div>
                            <CardMedia
                                className={classes.cover}
                                image={item.img}
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
