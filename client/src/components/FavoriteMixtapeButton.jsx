import React, { useContext, useState } from 'react';
import { Favorite as FavoriteIcon } from '@material-ui/icons';
import { favoriteMixtape, unfavoriteMixtape } from '../utils/api';
import UserContext from '../contexts/UserContext';
import Tooltip from '@material-ui/core/Tooltip';

function FavoriteMixtapeButton(props) {
    const { user, setUser } = useContext(UserContext);
    const [disabled, setDisabled] = useState(false);
    const favoriteButtonClickHandler = async () => {
        if (disabled) return;
        setDisabled(true);
        let favoritedMixtapes;
        if (user.favoritedMixtapes.includes(props.id)) {
            favoritedMixtapes = await unfavoriteMixtape(props.id);
        } else {
            favoritedMixtapes = await favoriteMixtape(props.id);
        }
        const newUser = { ...user};
        newUser.favoritedMixtapes = favoritedMixtapes;
        setUser(newUser);
        setDisabled(false);
    }
    return (
        <Tooltip title={(!user._id) ? 'Log in to use this feature!' : '' } >
        <span>
            <FavoriteIcon 
                disabled={!user._id}
                onClick={() => favoriteButtonClickHandler()} 
                style={
                    !user._id ? 
                    {
                        color: 'linear-gradient(45deg, #6b6b6b 30%, #3b3b3b 90%)', 
                        display: 'none'
                    } :
                    {color: disabled ? 'grey' : user?.favoritedMixtapes?.includes(props.id) ? 'red' : 'black', cursor:'pointer'}
                }
            /> 
        </span>
        </Tooltip>
    )
}

export default FavoriteMixtapeButton;
