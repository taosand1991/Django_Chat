import React, {Fragment} from 'react';
import authContext from "../Utils/AuthContext";
import {Link} from "react-router-dom";
import moment from "moment";

function Header(props) {
    const {roomMessages, typing,  username, roomNumber,
        createContact, is_thread, is_group, threadRoom, user, thread_typing} = React.useContext(authContext);
    const checkOnlineStatus = (date) =>{
        if(date.last_login > date.last_logout) return 'online';
        else return `last seen ${moment(date.last_logout).calendar()}`
    };


    return (
        <Fragment>
            <div className="header">
                <div className="social-links">
                    <div className='link2'>
                        <i className="fa fa-paperclip"/>
                        <div className="tool-tip">
                            <p>attach file</p>
                        </div>
                    </div>
                    <div className='link2'>
                        <i onClick={createContact} className="fa fa-plus"/>
                        <div className="tool-tip">
                            <p>create contact</p>
                        </div>
                    </div>
                    <div className='link2'>
                        <Link to='/logout'><i  className="fa fa-refresh"/></Link>
                        <div className="tool-tip">
                            <p>logout</p>
                        </div>
                    </div>
                    <div className='link2'>
                        <i className="fa fa-filter"/>
                        <div className="tool-tip">
                            <p>filter message</p>
                        </div>
                    </div>
                </div>
                {is_thread &&
                <div className="profile__authentication">
                    <div className="user-detail">
                        <i className="fa fa-user"/>
                    </div>
                    <div className="user-texts">
                        <h5>{threadRoom.first_user && threadRoom.first_user.id === user.user_id ? threadRoom.second_username : threadRoom.first_username}</h5>
                        {!thread_typing ? threadRoom.first_user && threadRoom.first_user.id === user.user_id ?
                            threadRoom.first_user && <small>{checkOnlineStatus(threadRoom.second_user)}</small> : threadRoom.second_user && <small>{checkOnlineStatus(threadRoom.first_user)}</small> : null }
                         {thread_typing ?  <small className='typing'>typing...</small> : null}
                    </div>
                </div>}
                {is_group &&
                <div className="profile__authentication">
                    <div className="user-detail">
                        <i className="fa fa-user"/>
                    </div>
                    <div className="user-texts">
                        <h5>{roomMessages.name}</h5>
                         {typing ? roomMessages.id === roomNumber && <small className='typing'>{username} is typing...</small> : null}
                        {roomMessages.users_lists && roomMessages.users_lists.length > 0 && <p className={typing ? 'none' : null}>{roomMessages.users_lists.length} users</p>}
                    </div>
                </div>}
            </div>
        </Fragment>
    );
}

export default Header;