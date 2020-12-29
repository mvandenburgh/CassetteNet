import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import { verifyUserLoggedIn } from '../../utils/api';

function VerifyLoginPage(props) {
    const history = useHistory();

    const { setUser } = useContext(UserContext);

    useEffect(() => {
        verifyUserLoggedIn().then(user => {
            setUser({ isLoggedIn: true, isGuest: false, ...user });
            history.push('/');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            Logging in...
        </div>
    )
}

export default VerifyLoginPage;
