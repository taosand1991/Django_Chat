import React, {Fragment, useState} from 'react';
import authContext from "../Utils/AuthContext";
import Token from '../Utils/authToken'
import axios from 'axios';
import pusher from "../Utils/pusher";

function Footer(props) {
    const {roomNumber, user, threadRoom, is_thread, is_group} = React.useContext(authContext);
    const [state, setState] = useState({message: ''});

    const handleChange = async (e) => {
        const {value} = e.target;
        pusher.connection.bind('user-typing');
        if (is_group) {
            const roomObject = {
                roomNumber: roomNumber,
                socket_id: pusher.connection.socket_id,
            };
            setState({message: value});
            if (value.length > 0) {
                await axios.post('/api/typing', roomObject, {
                    headers: {'Authorization': `JWT ${Token.userToken}`}
                })
            } else {
                await axios.get('/api/stop')
            }
        } else {
            const threadObject = {
                thread: threadRoom.id,
                socket_id: pusher.connection.socket_id,
            };
            setState({message: value});
            if (value.length > 0) {
                await axios.post('/api/thread-typing', threadObject, {
                    headers: {'Authorization': `JWT ${Token.userToken}`}
                })
            } else {
                await axios.get('/api/stop-thread')
            }
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (is_group) {
            const messageObject = {
                message: state.message,
                room: roomNumber,
                user: user.user_id
            };
            setState({message: ''});
            try {
                await axios.post('/api/messages/', messageObject);
                await axios.get('/api/stop');
                // getRoomMessages(roomNumber);
                // broadcastMessage()
            } catch (e) {
                console.log(e.response.data)
            }
        } else {
            const messageObject = {
            message: state.message,
            thread: threadRoom.id,
            user: user.user_id
        };
        setState({message: ''});
        try {
            await axios.post('/api/messages/', messageObject);
            await axios.get('/api/stop-thread');
        } catch (e) {
            console.log(e.response.data)
        }
        }

    };
    return (
        <Fragment>
            <div className="footer">
                <div className="message-icons">
                    <i className="fa fa-smile-o"/>
                    <i className="fa fa-paperclip"/>
                </div>
                <div className="form-input">
                    <form onSubmit={handleSubmit}>
                        <input disabled={!is_thread && !is_group}
                               type="text"
                               value={state.message}
                               onChange={handleChange}
                               placeholder="Type a message"/>
                    </form>
                </div>
                <div className="message-icon2">
                    <i className="fa fa-microphone"/>
                </div>
            </div>
        </Fragment>
    );
}

export default Footer;