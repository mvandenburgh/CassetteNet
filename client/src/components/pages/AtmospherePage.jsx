import React, { useContext } from 'react';
import { Button, Card, CardContent, CardMedia, IconButton, Grid, Typography, ThemeProvider, makeStyles, useTheme, createMuiTheme} from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import blueGrey from '@material-ui/core/colors/blueGrey';
import AtmosphereSoundContext from '../../contexts/AtmosphereSoundContext';
import CurrentSongContext from '../../contexts/CurrentSongContext';
import PlayerAnimationContext from '../../contexts/PlayerAnimationContext';
import { motion } from 'framer-motion';

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
const colortheme = createMuiTheme({
  palette: {
    primary: { main: "#FFFFFF", contrastText: "#fff" },
  }
});
const useStyles2 = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: blueGrey[700],
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
    const class2 = useStyles2();
    const theme = useTheme();

    const history = useHistory();
    const goBack = () => history.goBack();

    const { setAtmosphereSound } = useContext(AtmosphereSoundContext);
    
    const { currentSong } = useContext(CurrentSongContext);
    const { animating, setAnimating } = useContext(PlayerAnimationContext);

  const togglesVariants = {
    hidden: {
      scale: 1
    },
    visible: {
      scale: 1.1,
      transition: {
        yoyo: Infinity
      }
    }
  }

    const sounds = [
      { title: 'Rainy Day', filename: '/atmosphere/rain.mp3', img: '/atmosphere/rainy_window.png' },
      { title: 'Crowded Street', filename: '/atmosphere/city.mp3', img: '/atmosphere/city.png' },
      { title: 'Heavy Thunderstorm', filename: '/atmosphere/thunder.mp3', img: '/atmosphere/thunder.png' },
    ];

    const descriptions = [
      {desc : 'Would you like to enjoy some peaceful rain while listening to your favorite tracks? Start up some Rainy Day'},
      {desc : 'Miss the feeling of walking through the city with your earbuds plugged in? Try a crowded street.'},
      {desc : 'Would your favorite song go better with some thunder and lightning? Heavy Thunderstorms are here for you.'},

    ]

    return (
        <div style={{ color: 'white', left: 0, marginBottom: `${currentSong.playBarHeight}px` }}>
          <IconButton color="secondary" aria-label="back"  onClick={() => { goBack() }}>
            <ArrowBackIcon/>
          </IconButton>
          {animating?
                <motion.div variants={togglesVariants}
                initial="hidden"
                animate="visible">
                  <Typography align="center" variant="h2">Atmosphere Sound</Typography>
                </motion.div>
                :
                <Typography align="center" variant="h2">Atmosphere Sound</Typography>
                }
            
            <br />
            <Grid style={{padding: '10%'}} container spacing={3}>
                {sounds.map((item => {
                    return (<Grid item xs style={{ width: `${(1/sounds.length) * 100}%`}}>
                        <Card className={classes.root}>
                            <div className={classes.details}>
                                <CardContent className={classes.content}>
                                    <Typography component="h4" variant="h5">
                                        {item.title}
                                    </Typography>
                                </CardContent>
                                <div className={classes.controls}>
                                <Button variant="contained" onClick={() => setAtmosphereSound({ isPlaying: true, filename: item.filename })}>Select</Button>
                                </div>
                            </div>
                            <CardMedia
                                className={classes.cover}
                                image={item.img}
                                title="Rainy Day"
                            />
                        </Card>
                        <br/>
                        </Grid>);
                }
                ))}
                <Grid item xs={12}/>
                {descriptions.map((item =>{
                  return(<Grid item xs style={{ width: `${(1/sounds.length) * 100}%`}}>
                    <Card className={class2.root}>
                  <div className={class2.details}>
                      <CardContent className={class2.content}>
                      <ThemeProvider theme={colortheme}>
                          <Typography color="primary" component="h6" variant="h6">
                            {item.desc}
                          </Typography>
                      </ThemeProvider>
                      </CardContent>
                      </div>
                      </Card>
                    
                    </Grid>)
                  



              }))}
              
                
            </Grid>
        </div>
    );
}

export default AtmospherePage;
