import React, { useContext, useState } from 'react';
import { Favorite as FavoriteIcon } from '@material-ui/icons';
import { favoriteMixtape, unfavoriteMixtape } from '../utils/api';
import UserContext from '../contexts/UserContext';

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
        <FavoriteIcon onClick={() => favoriteButtonClickHandler()} style={{color: disabled ? 'grey' : user?.favoritedMixtapes?.includes(props.id) ? 'red' : 'black', cursor:'pointer'}} /> 
    )
}

export default FavoriteMixtapeButton;
