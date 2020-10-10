import React from 'react';
import axios from 'axios'
import Token from '../Utils/authToken'

function Logout(props) {
    window.location.href = '/login';
    const logMeOut = async() => {
        try{
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers:{'Authorization': `JWT ${Token.userToken}`}
            })
        }catch (e) {
            console.log(e.response.data)
        }
    };
     localStorage.clear();
    return (
        <div>
        <h5>Log out</h5>
            {logMeOut()}
        </div>
    );
}

export default Logout;