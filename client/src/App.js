import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Cookies from 'js-cookie';

import AdminLayout from "layouts/Admin.js";
import Login from "layouts/Login.js"
import SignUp from "layouts/SignUp.js"

class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
        authenticated: Cookies.get('authenticated') || false,
        customer_id: Cookies.get('customer_id') || null,
        username: Cookies.get('username') || null,
        userType: Cookies.get('userType') || null,
        accessToken: Cookies.get('accessToken') || null,
        accessToken: Cookies.get('email') || null,
    }
  }

  login = (info) => {

    Cookies.set('authenticated', info.authenticated);
    Cookies.set('customer_id',info.customer_id);
    Cookies.set('username', info.username);
    Cookies.set('userType', info.userType);
    Cookies.set('authToken', info.authToken);
    Cookies.set('email', info.email);

    this.setState({
      authenticated: info.authenticated,
      customer_id: info.customer_id,
      username: info.username,
      userType: info.userType,
      authToken: info.authToken,
      email: info.email
    })
  }

  logout = () => {
    Cookies.remove('username')
    Cookies.remove('customer_id')
    Cookies.remove('authenticated')
    Cookies.remove('userType')
    Cookies.remove('authToken')
    Cookies.remove('email')

    this.setState({
        authenticated: false,
        customer_id: null,
        username: null,
        userType: null,
        authToken: null,
        email: null,
    })
  }



  render() {
    return (
        <BrowserRouter>
            {this.state.authenticated ? 
                <Switch>
                    <Route path="/admin" render={(props) => <AdminLayout {...props} logout={this.logout} />} />
                    <Redirect from="/" to="/admin/dashboard" />
                </Switch> :
                <Switch>
                    <Route path="/login" render={(props) => <Login {...props} login={this.login}/>} />
                    <Route path="/signup" render={(props) => <SignUp {...props} />} />
                    <Redirect from="*" to="/login" />
                </Switch>  
            }
        </BrowserRouter>
    );
  }
}

export default App;