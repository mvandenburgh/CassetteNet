import React, { useState } from 'react';
import { Button, Grid, TextField, Typography, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { setUsernameOfOAuthAccount } from '../../utils/api';


function OAuthUsernamePage(props) {
    const useStyles = makeStyles((theme) => ({
        margin: {
            margin: theme.spacing(1),
        },
        TextStyle: {
            color: "white",
        }
    }));

    const classes = useStyles();

    const history = useHistory();

    const [username, setUsername] = useState('');

    const handleUsername = (e) => setUsername(e.target.value);

    const submit = async () => {
        try {
            await setUsernameOfOAuthAccount(username);
            history.push('/login/success');
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div style={{ color: 'white', left: 0 }}>
            <div className={classes.margin}>
                <Grid container spacing={1} alignItems="center" direction="column">
                    <Typography variant="h5">Please enter a username:</Typography>
                </Grid>
                <Grid container spacing={1} alignItems="center" direction="column">
                    <Grid item sz={1}>
                    </Grid>
                    <Grid item>
                        <TextField
                            className={classes.margin}
                            onChange={handleUsername}
                            value={username}
                            variant="outlined" label="Username" />
                    </Grid>
                    <Button variant="filled" color="inherit" onClick={submit}>
                        Submit
                    </Button>
                </Grid>
            </div>
        </div>
    );
}

export default OAuthUsernamePage;
