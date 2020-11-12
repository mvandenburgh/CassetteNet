import React, { useContext } from 'react';
import { Favorite as FavoriteIcon } from '@material-ui/icons';
import { favoriteMixtape, unfavoriteMixtape } from '../utils/api';
import UserContext from '../contexts/UserContext';

function FavoriteMixtapeButton(props) {
    const { user, setUser } = useContext(UserContext);
    const favoriteButtonClickHandler = async () => {
        let favoritedMixtapes;
        if (user.favoritedMixtapes.includes(props.id)) {
            favoritedMixtapes = await unfavoriteMixtape(props.id);
        } else {
            favoritedMixtapes = await favoriteMixtape(props.id);
        }
        const newUser = { ...user};
        newUser.favoritedMixtapes = favoritedMixtapes;
        setUser(newUser);
    }
    return (
        <FavoriteIcon onClick={() => favoriteButtonClickHandler()} style={{color: user?.favoritedMixtapes?.includes(props.id) ? 'red' : 'black', cursor:'pointer'}} /> 
    )
}

export default FavoriteMixtapeButton;
