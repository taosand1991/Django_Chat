import React, {Fragment, useEffect} from 'react';
import authContext from "../Utils/AuthContext";
import moment from "moment";

function Body({match}) {
    const {roomMessages, user, getRoomMessages} = React.useContext(authContext);
    const { room } = match.params;
    useEffect(() => {
        getRoomMessages(parseInt(room))
    }, [room, getRoomMessages]);
    return (
        <Fragment>
            <div className="body">
                {roomMessages.message && roomMessages.message.length > 0 ? <>
                {roomMessages.message && roomMessages.message.map(room => {
                    return <div key={room.id} className={user.username === room.user_name ? "message__details sender" : "message__details"}>
                        <div className={user.username === room.user_name ? "pointer2" : 'pointer'}/>
                        {user.username !== room.user_name ? <h4>{room.user_name}</h4>: null}
                        <p>{room.message}</p>
                        <small className="float-message">{moment(room.time_stamp).format('LT')}</small>
                    </div>
                })}

                </>
                :
                <div className='empty-message'>
                    <div className="empty-icon">
                        <i className='fa fa-star-half-o'/>
                    </div>
                    <div className="empty-text">
                        <h5>Click on a group to start a chat</h5>
                    </div>
                </div>
                }
            </div>
        </Fragment>
    );
}

export default Body;