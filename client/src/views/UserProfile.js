import React from "react";

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Cookies from 'js-cookie';
import axios from 'axios';

class User extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      "customer_id": Cookies.get('customer_id')
    }
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/info/${this.state.customer_id}`, {headers: {"Access-Control-Allow-Origin": "*"}})
        .then((response) => {
            this.setState(response.data)
            console.log(this.state)
        }, (error) => {
            console.log(error);
        });
  }

  updateProfile= () => {
    console.log(this.state)
    axios.post('http://localhost:8000/update', {
      customer_id: this.state.customer_id,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      company: this.state.company,
      email: this.state.email,
      contact: this.state.contact,
    }, {headers: {"Access-Control-Allow-Origin": "*"}})
    .then((response) => {
      console.log(response);
      alert("Information Updated!")
    }, (error) => {
      console.log(error);
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

  handlePhoneNumberChange = event => { 
    this.setState({
        contact: event.target.value
    })
  }

  handleCompanyChange = event => { 
    this.setState({
        company: event.target.value
    })
  }
 

  render () {
    return (
      <>
        <Container fluid>
          <Row>
            <Col md="12">
              <Card>
                <Card.Header>
                  <Card.Title as="h4">Edit Profile</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col className="pr-1" md="5">
                        <Form.Group>
                          <label>Company</label>
                          <Form.Control
                            defaultValue={this.state.company}
                            placeholder="Company"
                            type="text"
                            onChange={this.handleCompanyChange}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="pl-1" md="7">
                        <Form.Group>
                          <label htmlFor="exampleInputEmail1">
                            Email Address (Disabled)
                          </label>
                          <Form.Control
                            placeholder="Email"
                            type="email"
                            defaultValue={this.state.email}
                            disabled
                            onChange={this.handleEmailChange}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="6">
                        <Form.Group>
                          <label>First Name</label>
                          <Form.Control
                            defaultValue={this.state.first_name}
                            placeholder="Company"
                            type="text"
                            onChange={this.handleFirstNameChange}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="pl-1" md="6">
                        <Form.Group>
                          <label>Last Name</label>
                          <Form.Control
                            defaultValue={this.state.last_name}
                            placeholder="Last Name"
                            type="text"
                            onChange={this.handleLastNameChange}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <Form.Group>
                          <label>Contact</label>
                          <Form.Control
                            defaultValue={this.state.contact}
                            placeholder="Contact Number"
                            type="text"
                            onChange={this.handlePhoneNumberChange}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button
                      className="btn-fill pull-right"
                      type="button"
                      variant="info"
                      onClick={this.updateProfile}
                    >
                      Update Profile
                    </Button>
                    <div className="clearfix"></div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
          </Row>
        </Container>
      </>
    );
  }
  
}

export default User;
