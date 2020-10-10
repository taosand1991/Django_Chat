import React, {Fragment} from 'react';
import authContext from "../Utils/AuthContext";

function EmptyBody(props) {
     const {roomMessages, user} = React.useContext(authContext);
    return (
        <Fragment>
            <div className="empty-body">
                {roomMessages.message && roomMessages.message.length > 0 ? <>
                {roomMessages.message && roomMessages.message.map(room => {
                    return <div key={room.id} className={user.username === room.user_name ? "message__details sender" : "message__details"}>
                        <div className={user.username === room.user_name ? "pointer2" : 'pointer'}/>
                        {user.username !== room.user_name ? <h4>{room.user_name}</h4>: null}
                        <p>{room.message}</p>
                        <small className="float-message">9:40am</small>
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

export default EmptyBody;