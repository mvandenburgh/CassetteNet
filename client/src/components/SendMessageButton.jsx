import React, { useContext, useState } from 'react';
import { Button } from '@material-ui/core';
import { sendDM } from '../utils/api';
import UserContext from '../contexts/UserContext';

function SendMessageButton(props) {
    const { user, setUser } = useContext(UserContext);
    const [disabled, setDisabled] = useState(props.disabled);

    return (
        <Button
            disabled={disabled || user._id == props.id}
            variant="contained"
            boxShadow={3}
            style={{
                marginTop: '40px',
                height: '45px',
                width: '80px',
                backgroundColor: props.backgroundColor,
            }}
        > Send Message</Button>
    )
}

export default SendMessageButton;
