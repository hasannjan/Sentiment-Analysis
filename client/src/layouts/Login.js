import React from 'react';
import { Form, Container, Col, Button, Card, InputGroup } from 'react-bootstrap';
// import { Satellite } from '@material-ui/icons';

// import { FontAwesomeIcon } from '@fortawesome/fontawesome-free'
// import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import '../assets/css/Login.css'
import axios from 'axios';
import Cookies from 'js-cookie';
import logo from "assets/img/logo.png";





class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    callLoginAPI = () => {
        axios.post('http://localhost:8000/login', {
            email: this.state.email,
            password: this.state.password
        }, { headers: { "Access-Control-Allow-Origin": "*" } })
            .then((response) => {

                const info = {
                    authenticated: response.data.authenticated,
                    customer_id: response.data.customer_id,
                    username: response.data.username,
                    userType: response.data.userType,
                    authToken: response.data.authToken,
                    email: response.data.email
                }

                this.props.login(info)

            }, (error) => {
                console.log(error);
            });
    }

    handleEmailChange = event => {

        this.setState({
            email: event.target.value
        })
    }

    handlePasswordChange = event => {
        this.setState({
            password: event.target.value
        })
    }
    render() {
        return (
         <div className="Loginbody" style={{"height": "969px", }} >
            <Container className="d-flex align-items-center" style={{"height": "969px", }} >
            <div className="d-flex align-content-start flex-wrap "  >
        
               
                <div  className="loginlogo">
               
                    <h>Welcome To Reviews Insight</h></div>
               
              </div>
                   
              <div className="d-flex align-content-end flex-wrap  ">
              <Card className="logincard">
                            <h3 className="loginheading">SignIn</h3>
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="formGroupEmail">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend >                                   
                                            <InputGroup.Text >
                                            {<PersonIcon/>}
                                            </InputGroup.Text>                                                                     
                                            </InputGroup.Prepend>
                                            <Form.Control type="text" placeholder="EMAIL" onChange={this.handleEmailChange} />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="formGroupPassword">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend >
                                            <InputGroup.Text >
                                            {<LockIcon/>}
                                            </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control type="password" placeholder="PASSWORD" onChange={this.handlePasswordChange} />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group>
                                        <Button className="btn btn-info btn-block" onClick={this.callLoginAPI}>Log In</Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                            <Card.Footer>
                                <div className="d-flex justify-content-center links">
                                    Don't have an account?<a href="/signup" onClick={this.signup}>SignUp</a>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <a href="/forget">Forgot your password?</a>
                                </div>
                            </Card.Footer>
                        </Card>
                        </div>
                    
                   
                
                    
                 </Container> 
            </div>


        )
    }
}

export default Login;