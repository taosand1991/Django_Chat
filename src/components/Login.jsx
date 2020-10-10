import React, {Component, Fragment} from 'react';
import Input from "../Utils/Input";
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: true,
            isRegister: false,
            login_account: {username: '', password: ''},
            reg_account: {username_1: '', password_1: '', password_2: ''},
            image:null,
            loading: false,
            errors: {},
        }
    }

    setLogin = () => {
        this.setState({isLogin: true, isRegister: false})
    };

    setRegister = () => {
        this.setState({isLogin: false, isRegister: true})
    };

    handleLoginChange = (e) => {
        const login_account = {...this.state.login_account};
        login_account[e.target.name] = e.target.value;
        this.setState({login_account})
    };

    handleRegChange = (e) => {
        const reg_account = {...this.state.reg_account};
        reg_account[e.target.name] = e.target.value;
        this.setState({reg_account})
    };

    handleLoginSubmit = async (e) => {
        e.preventDefault();
        this.setState({loading: true});
        const {login_account} = this.state;
        const object = {
            username: login_account.username,
            password: login_account.password,
        };
        try {
            const response = await axios.post('http://localhost:8000/auth/login/', object);
            localStorage.setItem('token', response.data.token);
            setTimeout(() => {
                this.setState({loading: false});
                window.location = '/chat'
            }, 2500)
        } catch (e) {
            this.setState({loading: false});
            const errors = {...this.state.errors};
            errors['login'] = e.response.data['non_field_errors'];
            this.setState({errors})
            console.log(errors)
        }

    };
    handleImageChange = (e) => {
        this.setState({image:e.target.files[0]})
    };

    handleRegisterSubmit = async(e) => {
        e.preventDefault();
        const {reg_account, image} = this.state;
        console.log(image)
        const form_data = new FormData();
        this.setState({loading:true});
        form_data.append('username', reg_account.username_1);
        form_data.append('password', reg_account.password_1);
        form_data.append('password2', reg_account.password_2);
        form_data.append('thumbnail', image, image.name );
        try{
            const response = await axios.post('http://localhost:8000/api/user/', form_data, {
                headers:{'Content-Type': 'multipart/form-data'}
            });
            localStorage.setItem('token', response.data.token);
            console.log(response)
            setTimeout(() => {
                this.setState({loading:false});
                window.location.href = '/chat'
            }, 2000)
        }catch (e) {
            this.setState({loading:false});
           const errors = {...this.state.errors} ;
           errors['username'] = e.response.data['username'];
            this.setState({errors})
        }
    };


    render() {
        const {isLogin, isRegister, login_account, reg_account, loading, errors} = this.state;
        return (
            <Fragment>
                {loading && <div className='spinner'/>}
                <div className="authentication">
                    <div className="auth-button">
                        <button className={isLogin ? 'dark' : null} onClick={this.setLogin}>Login</button>
                        <button className={isRegister ? 'dark' : null} onClick={this.setRegister}>Register</button>
                    </div>
                    <div className="authorize">
                        <div className={isLogin ? 'login-section show' : 'login-section'}>
                            <div className="form-section">
                                {errors.login && <small style={{color: 'red'}}>{errors.login}</small>}
                                <form onSubmit={this.handleLoginSubmit}>
                                    <Input placeholder='username'
                                           className='input-class'
                                           label='Username'
                                           value={login_account.username}
                                           onchange={this.handleLoginChange}
                                           name='username'
                                           type='text'/>
                                    <Input placeholder='Password'
                                           className='input-class'
                                           value={login_account.password}
                                           name='password'
                                           onchange={this.handleLoginChange}
                                           label='Password'
                                           type='password'/>
                                    <button>Login</button>
                                </form>
                            </div>
                        </div>
                        <div className={isRegister ? 'register-section show' : 'register-section'}>
                            <div className="form-section">
                                {errors.username && <small style={{color:'red'}}>{errors.username}</small> }
                                <form onSubmit={this.handleRegisterSubmit}>
                                    <Input placeholder='Enter Username'
                                           label='Username'
                                           required
                                           value={reg_account.username}
                                           name='username_1'
                                           onchange={this.handleRegChange}
                                           className='input-class'
                                           type='text'/>
                                    <Input placeholder='Password'
                                           required
                                           className='input-class'
                                           value={reg_account.password_1}
                                           name='password_1'
                                           onchange={this.handleRegChange}
                                           label='Password'
                                           type='password'/>
                                    <Input placeholder='Confirm password'
                                           className='input-class'
                                           required
                                           onchange={this.handleRegChange}
                                           value={reg_account.password_2}
                                           name='password_2'
                                           label='Confirm Password'
                                           type='password'/>
                                    <Input type='file'
                                           label='profile picture'
                                           required
                                           onchange={this.handleImageChange}
                                           className='input-class'/>
                                    <button className=''>Create User</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Login;