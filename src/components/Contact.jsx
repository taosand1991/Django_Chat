import React, {Fragment} from 'react';
import authContext from "../Utils/AuthContext";
import {Link} from "react-router-dom";

function Contact(props) {
    const {filterRooms, threads, user, thread_typing, handleSearchContact, searchText} = React.useContext(authContext);
    return (
        <Fragment>
            <div className="contact">
                <div className="form-class">
                    <form action="#">
                        <input type="text"
                                value={searchText}
                               onChange={handleSearchContact}
                               placeholder="search for chat"/>
                        <i className="fa fa-search"/>
                    </form>
                </div>
                {filterRooms.map(room => {
                    return <div key={room.id} className="contact-details">
                        <div className="contact-pic">
                            <i className='fa fa-user'/>
                        </div>
                        <div  className="contact-name">
                            <Link to={`/chat/body/${room.id}`}>
                            <h5>{room.name}</h5>
                            {room.message.length > 0 && <p className={'clicked'}>{room.message[room.message.length - 1].message}</p>}
                            </Link>
                            </div>
                    </div>
                })}

                    {threads.map(thread => {
                         return <div key={thread.id} className="contact-details">
                        <div className="contact-pic">
                            <i className='fa fa-user'/>
                        </div>
                        <div   className="contact-name">
                            <Link to={`/chat/thread/${thread.first_user.id}/${thread.second_user.id}`}>
                                <h5>{thread.first_user.id === user.user_id ? thread.second_username : thread.first_username}</h5>
                                {!thread_typing && <>  {thread.thread_messages.length > 0 && <p className={'clicked'}>{thread.thread_messages[thread.thread_messages.length - 1].message}</p>} </>}
                                {thread_typing && <small>Typing.....</small>}
                            </Link>
                        </div>
                    </div>
                    })}
            </div>
        </Fragment>
    );
}

export default Contact;