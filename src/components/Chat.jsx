import React, {Component, Fragment} from 'react';
import Header from "./Header";
import Contact from "./Contact";
import Body from "./Body";
import Footer from "./Footer";
import Create from "./Create";
import {Switch, Route} from "react-router-dom";
import Thread from "./Thread";
import EmptyBody from "./EmptyBody";

class Chat extends Component {
    render() {
        return (
            <Fragment>
                <div className='container__wrapper'>
                    <Header/>
                    <Contact/>
                    <Create/>
                    <EmptyBody/>
                    <Switch>
                        <Route path='/chat/body/:room' component={Body}/>
                        <Route path='/chat/thread/:first_user/:second_user' component={Thread}/>
                    </Switch>
                    <Footer/>
                </div>
            </Fragment>
        );
    }
}

export default Chat;