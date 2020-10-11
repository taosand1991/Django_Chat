import React, {Component, Fragment} from 'react';
import authContext from "../Utils/AuthContext";
import jwtDecode from 'jwt-decode';
import Token from '../Utils/authToken'
import Login from "./Login";
import Chat from "./Chat";
import {Switch, Route, Redirect} from 'react-router-dom'
import axios from 'axios'
import pusher from "../Utils/pusher";
import Logout from "./Logout";

class MainComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:{},
            username:'',
            rooms:[],
            roomMessages:{},
            roomNumber:0,
            typing:false,
            create:false,
            threads:[],
            thread:{},
            threadRoom:{},
            is_thread:false,
            is_group:false,
            thread_typing:false,
            searchText:'',
        };

    }

    async componentDidMount() {
        if(Token.userToken){
            const user = jwtDecode(Token.userToken);
            this.setState({user});
            this.getRooms();
            this.getThreads()
        }
         const channel = pusher.subscribe('messages');
        const that = this;
        channel.bind('send-message', function (message) {
            if(that.state.is_group){
                that.getRoomMessages(that.state.roomNumber);
            }else{
                 that.getThreadNumber(that.state.thread.first_user, that.state.thread.second_user);
            }
            that.getRooms();
            that.getThreads();
        });
        channel.bind('user-typing', function (data) {
            that.setUserName(data.user);
           if(that.state.roomNumber === data.room_number){
               that.setState({typing:true})
           }

        });
        channel.bind('stop-typing', function () {
            that.setState({typing:false})
        });
        channel.bind('thread-typing', function (data) {
           if(that.state.threadRoom.id === data.thread_id){
               that.setState({thread_typing:true})
           }
        });
        channel.bind('stop-thread', function () {
            that.setState({thread_typing:false})
        });
    }

    componentWillUnmount() {
        pusher.unsubscribe('messages');
        pusher.unbind_all()
    }

    broadcastMessage = () => {
        const channel = pusher.subscribe('messages');
        const that = this;
        channel.bind('send-message', function (message) {
           that.getRoomMessages(that.state.roomNumber)
        })

    };
    setUserName = (username) => {
        this.setState({username})
    };
    createContact = () => {
        this.setState({create:!this.state.create})
    };

    getRooms = async() => {
        const apiCall = '/api/rooms/';
        try{
                const {data:rooms} = await axios.get(apiCall);
            this.setState({rooms});
            }catch (e) {

            }
    };

    getRoomMessages = async(room) => {
        this.setState({roomNumber:room, clicked:true, is_group:true, is_thread:false});
        const apiCall = `/api/room/${room}/`;
        try{
                const roomMessag = await axios.get(apiCall, {
                    headers:{'Authorization' : `JWT ${Token.userToken}`}
                });
            this.setState({roomMessages : roomMessag.data});
            const bodyHeight = document.querySelector('.body');
            bodyHeight.scroll(0, bodyHeight.scrollHeight);
            }catch (e) {
                // console.log(e.response.data)
            }
    };

    getThreads = async() => {

        try {
            const {data:threads} = await axios.get('/api/list', {
                headers: {'Authorization': `JWT ${Token.userToken}`}
            });
            this.setState({threads})
        }catch (e) {
            console.log(e.response.data)
        }
    };

    getThreadNumber = async(first_user, second_user) => {
        const thread = {...this.state.thread};
        thread['first_user'] = first_user;
        thread['second_user'] = second_user;
        this.setState({thread,  is_thread:true, is_group:false});
        try {
            const {data:threadRoom} = await axios.get(`/api/get_thread/${first_user}/${second_user}/`)
            this.setState({threadRoom});
            const bodyHeight = document.querySelector('.thread-body');
            bodyHeight.scroll(0, bodyHeight.scrollHeight);
        }catch (e) {
        }
    };

    handleSearchContact = (e) => {
        this.setState({searchText: e.target.value})
    };

    render() {
        const filterRooms = this.state.rooms.filter(room => {
            return room.name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1
        });
        const {user, rooms, roomMessages, roomNumber, typing,
            username, create, threads, threadRoom, thread,
            is_group, is_thread, thread_typing, searchText} = this.state;
        const { getRoomMessages, broadcastMessage, setUserName,
            createContact, getThreadNumber, handleSearchContact } = this;
        return (
            <Fragment>
                <authContext.Provider value={{user, rooms, roomMessages, getRoomMessages, roomNumber,
                broadcastMessage, typing, setUserName,
                    username, create, createContact, threads,
                    getThreadNumber, threadRoom, handleSearchContact,
                    thread, is_thread, is_group, thread_typing, searchText, filterRooms}}>
                    <Switch>
                        <Route path='/login' component={Login}/>
                        <Route path='/chat' component={Chat}/>
                        <Route path='/logout' component={Logout}/>
                        <Redirect to='/login'/>
                    </Switch>
                </authContext.Provider>
            </Fragment>
        );
    }
    static contextType = authContext;
}

export default MainComponent;