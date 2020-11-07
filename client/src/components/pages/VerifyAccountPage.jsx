import React from 'react';
import { userVerifyAccount } from '../../utils/api';

// TODO: improve styling/actually make this component
function VerifyAccountPage(props) {
    const { token } = props.match.params;

    userVerifyAccount(token)
        .then(() => alert('Account verification successful!'))
        .catch(err => alert(err));

    return (
        <div>

        </div>
    )
}

export default VerifyAccountPage;
