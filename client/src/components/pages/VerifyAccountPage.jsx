import React from 'react';
import { useHistory } from 'react-router-dom';
import { userVerifyAccount } from '../../utils/api';

// TODO: improve styling/actually make this component
const showAlert = (token) => {
    userVerifyAccount(token)
    .then(() => {
        console.log("Showing alert..");
        alert('Account verification successful!');

    })
    .catch(err => alert(err));
}

function VerifyAccountPage(props) {
    const { token } = props.match.params;
    
    showAlert(token);
    const history = useHistory();
    history.push('/login');
    return (
        <div>

        </div>
    )
}

export default VerifyAccountPage;
