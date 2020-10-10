import React, {Fragment, useEffect} from 'react';
import authContext from "../Utils/AuthContext";
import moment from "moment";

function Thread({match}) {
     const {user, threadRoom, getThreadNumber} = React.useContext(authContext);
     const {first_user, second_user} = match.params;
     useEffect(() => {
        getThreadNumber(first_user, second_user)
     },[first_user, getThreadNumber, second_user]);

    return<Fragment>
            <div className="thread-body">
                {threadRoom.thread_messages && threadRoom.thread_messages.map(message => {
                    return <div key={message.id}
                                className={user.username === message.user_name ? "message__details sender" : "message__details"}>
                        <div className={user.username === message.user_name ? "pointer2" : 'pointer'}/>
                        {user.username !== message.user_name ? <h4>{message.user_name}</h4> : null}
                        <p>{message.message}</p>
                        <small className="float-message">{moment(message.time_stamp).format('LT')}</small>
                    </div>
                })}
            </div>
        </Fragment>
}
export default Thread;