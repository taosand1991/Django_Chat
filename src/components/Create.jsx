import React, {Fragment, useState} from 'react';
import authContext from "../Utils/AuthContext";
import Token from '../Utils/authToken'
import axios from 'axios';

function Create(props) {
    const {create, createContact} = React.useContext(authContext);
    const [state, setState] = useState({username:'', loading:false});

    const handleChange = (e) => {
        const {value} = e.target;
        setState({username : value})
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setState(prevState => ({
            ...prevState,
            loading:true
        }));
        const contactObject = {
            other_user: state.username,
        };
        try {
            await axios.post('/api/create', contactObject, {
                headers:{'Authorization': `JWT ${Token.userToken}`}
            });
            setTimeout(() => {
                setState(prevState => ({
                    ...prevState,
                    loading:false,
                    username:''
                }));
                createContact();
            }, 1500)

        }catch (e) {
            setState(prevState => ({
                    ...prevState,
                    loading:false,
                }));
            console.log(e.response.data)
        }
    };
    return (
        <Fragment>
            <div className={create ? "fixed-create showing" : "fixed-create"}>
                <div className="form-action">
                    {state.loading && <div className='spinner'/> }
                    <h5>Create Your contact</h5>
                    <i onClick={createContact} className='fa fa-close'/>
                    <form onSubmit={handleSubmit}>
                        <input className='input-class'
                               value={state.username}
                               onChange={handleChange}
                               type="text"
                               placeholder='enter username'/>
                        <button>Create</button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default Create;