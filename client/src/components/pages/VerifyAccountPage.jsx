import React from 'react';
import { useHistory } from 'react-router-dom';
import { userVerifyAccount } from '../../utils/api';

// TODO: improve styling/actually make this component
const showAlert = () => {
    console.log("Showing alert..");
    alert('Account verification successful!');
}

function VerifyAccountPage(props) {
    const { token } = props.match.params;
    const history = useHistory();
    userVerifyAccount(token)
        .then(() => {
            showAlert();
            history.push('/login');
        })
        .catch(err => alert(err));

    return (
        <div>

        </div>
    )
}

export default VerifyAccountPage;
