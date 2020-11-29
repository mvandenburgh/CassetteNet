import React from 'react';
import Icon from '@material-ui/core/Icon';

function SoundcloudIcon() {
    return (
        <Icon style={{ right: 0, bottom: 0, position: 'absolute', margin: '0.5em' }}>
            <img src="../icons/soundcloud.svg" alt="soundcloud_icon"/>
        </Icon>
    )
}

export default SoundcloudIcon;
