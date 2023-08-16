import React from 'react';
import { Form, Container, Col, Button, Navbar, Card, InputGroup } from 'react-bootstrap';
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import SettingsPhoneRoundedIcon from '@material-ui/icons/SettingsPhoneRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import BusinessRoundedIcon from '@material-ui/icons/BusinessRounded';
import '../assets/css/SignUp.css'
import axios from 'axios';

class SignUp extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            
        }
    }

    signup = () => {
        axios.post('http://localhost:8000/signup', {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            company: this.state.company,
            email: this.state.email,
            phone: this.state.phone,
            password: this.state.password
        }, {headers: {"Access-Control-Allow-Origin": "*"}})
        .then((response) => {
            
            
            alert(response)
          
        }, (error) => {
            console.log(this.state);
        });
    }

    handleFirstNameChange = event =>  { 
       
        this.setState({
            first_name: event.target.value
        })
    }
    handleLastNameChange = event =>  { 
       
        this.setState({
            last_name: event.target.value
        })
    }
    handleOrganizationNameChange = event => { 
        this.setState({
            company: event.target.value
        })
    }
    handlePhoneNumberChange = event => { 
        this.setState({
            phone: event.target.value
        })
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
            
            <div className="Signupbody" style={{"height": "969px" }}>
                    <Container className="d-flex align-items-center" style={{"height": "969px"}}>
                    <div className="d-flex align-content-start flex-wrap "> 
                  <div  className="signuplogo"><h>Welcome To Reviews Insight</h></div>
               
                  </div>
              
            
                  <div className="d-flex align-content-end flex-wrap  ">
                         <Card classname="signupcard" style={{"width": "380px","margin-top": "-50px","margin-left": "200px",  "border": "transparent", "background-color": "transparent", }}> 
                        
                                <h4 className="Signupheading">Sign Up</h4>
                            
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="formGroupFirstname">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend >
                                            <InputGroup.Text >
                                            {<PersonIcon/>}
                                            </InputGroup.Text>                                        
                                            </InputGroup.Prepend>
                                            <Form.Control type="text" placeholder="First Name" onChange={this.handleFirstNameChange}/>  
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="formGroupLastname">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend >
                                            <InputGroup.Text >
                                            {<PersonIcon/>}
                                            </InputGroup.Text>                                      
                                            </InputGroup.Prepend>
                                            <Form.Control type="text" placeholder="Last Name" onChange={this.handleLastNameChange}/>  
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="formGroupOrganizationName">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend >
                                            <InputGroup.Text >
                                            {<BusinessRoundedIcon/>}
                                            </InputGroup.Text> 
                                            </InputGroup.Prepend>
                                            <Form.Control type="text" placeholder="Organization Name" onChange={this.handleOrganizationNameChange}/>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="formGroupEmail">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend >
                                            <InputGroup.Text >
                                            {<EmailRoundedIcon/>}
                                            </InputGroup.Text>       
                                            </InputGroup.Prepend>
                                            <Form.Control type="text" placeholder="Email" onChange={this.handleEmailChange}/>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="formGroupPhone">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend >
                                            <InputGroup.Text >
                                            {<SettingsPhoneRoundedIcon/>}
                                            </InputGroup.Text>                                        
                                            </InputGroup.Prepend>
                                            <Form.Control type="text" placeholder="Phone Number" onChange={this.handlePhoneNumberChange}/>  
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="formGroupPassword">
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend >
                                            <InputGroup.Text >
                                            {<LockIcon/>}
                                            </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
                                        </InputGroup>
                                    </Form.Group>                           
                                    <Form.Group>
                                        <Button className="btn btn-info btn-block" onClick={this.signup}>SignUp</Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                                 
                         </Card> 
                        
                    </div>
                </Container>
            </div>
           
        )
    }
}

export default SignUp;