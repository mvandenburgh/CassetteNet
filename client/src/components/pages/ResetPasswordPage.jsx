import React, { useState } from 'react';
import { Button, Grid, TextField, Typography, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { resetPassword } from '../../utils/api';


function ResetPasswordPage(props) {
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

    const [password, setPassword] = useState('');

    const { token } = props.match.params;

    const handlePassword = (e) => setPassword(e.target.value);

    const submit = async () => {
        try {
            await resetPassword(token, password);
            alert('Password reset successfully!')
            history.push('/login/');
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div style={{ color: 'white', left: 0 }}>
            <div className={classes.margin}>
                <Grid container spacing={1} alignItems="center" direction="column">
                    <Typography variant="h5">Enter a new password:</Typography>
                </Grid>
                <Grid container spacing={1} alignItems="center" direction="column">
                    <Grid item sz={1}>
                    </Grid>
                    <Grid item>
                        <TextField
                            className={classes.margin}
                            onChange={handlePassword}
                            value={password}
                            variant="outlined" label="Username" />
                    </Grid>
                    <Button variant="filled" color="inherit" onClick={submit}>
                        Change Password
                    </Button>
                </Grid>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
