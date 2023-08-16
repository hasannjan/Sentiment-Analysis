import React from "react";
import ChartistGraph from "react-chartist";
import Cookies from 'js-cookie';
import axios from 'axios';
import {Spinner} from 'react-bootstrap'
import "assets/css/dashboard.css"

// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

class Dashboard extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
        "loaded": false,
        "customer_id": Cookies.get('customer_id'),
        "summary": {
            "total": 0,
            "positive": 0,
            "negative": 0
        },
        "overall": {
            "positive_percentage": 0,
            "negative_percentage": 0
        },
        "monthly": {
            "months": [],
            "counts": {
                "positive": [],
                "negative": [],
                "total": [],
            }
        },
        "yearly": {
          1900: {}
        },
        "recent": [],
        "selectedYear": 2023,
        "years": []
    }
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/usage/${this.state.customer_id}`, {headers: {"Access-Control-Allow-Origin": "*"}})
        .then((response) => {
            this.setState(response.data)
            this.setState({loaded: true})
            var years = Object.keys(response.data.yearly)
            this.setState({years: years.reverse()})
            this.setState({selectedYear: years[0]})
        }, (error) => {
            console.log(error);
        });
  }

  changeSomething = event => {
    this.setState({selectedYear: event.target.value})
  }

  render () {
    if (!this.state.loaded){
      return(
        <Container fluid>
          <div className="centered">
            <Spinner style={{width:'130px', height:'130px'}} animation="border" />
          </div>
        </Container>
      )
    } else {
      return (
        <>
          <Container fluid>
            <Row>
              <Col lg="4" sm="6">
                <Card className="card-stats">
                  <Card.Body>
                    <Row>
                      <Col xs="5">
                        <div className="icon-big text-center icon-warning">
                          <i className="nc-icon nc-cloud-upload-94 text-success"></i>
                        </div>
                      </Col>
                      <Col xs="7">
                        <div className="numbers">
                          <p className="card-category">Reviews Processed</p>
                          <Card.Title as="h4">{this.state.summary.total}</Card.Title>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer>
                    <hr></hr>
                    <div className="stats">
                      <i className="far fa-calendar-alt mr-1"></i>
                      
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
              <Col lg="4" sm="6">
                <Card className="card-stats">
                  <Card.Body>
                    <Row>
                      <Col xs="5">
                        <div className="icon-big text-center icon-warning">
                          <i className="nc-icon nc-simple-add text-info"></i>
                        </div>
                      </Col>
                      <Col xs="7">
                        <div className="numbers">
                          <p className="card-category">Positive Reviews</p>
                          <Card.Title as="h4">{this.state.summary.positive}</Card.Title>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer>
                    <hr></hr>
                    <div className="stats">
                      <i className="far fa-calendar-alt mr-1"></i>
                      
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
              <Col lg="4" sm="6">
                <Card className="card-stats">
                  <Card.Body>
                    <Row>
                      <Col xs="5">
                        <div className="icon-big text-center icon-warning">
                          <i className="nc-icon nc-simple-remove text-danger"></i>
                        </div>
                      </Col>
                      <Col xs="7">
                        <div className="numbers">
                          <p className="card-category">Negative Reviews</p>
                          <Card.Title as="h4">{this.state.summary.negative}</Card.Title>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer>
                    <hr></hr>
                    <div className="stats">
                      <i className="far fa-calendar-alt mr-1"></i>
                      
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
            <Row>
            <Col md="8">
                <select className="form-control" onChange={this.changeSomething}>
                  {
                    this.state.years.map((year, idx) => {
                      return <option key={idx}>{year}</option>
                      } 
                    )
                  }
                </select>
                <Card>
                  <Card.Header>
                    <Card.Title as="h4">{this.state.selectedYear} Sentiment</Card.Title>
                    <p className="card-category">All Products</p>
                  </Card.Header>
                  <Card.Body>
                    <div className="ct-chart" id="chartActivity">
                      <ChartistGraph
                        data={{
                          labels: this.state.yearly[this.state.selectedYear].months,
                          series: [this.state.yearly[this.state.selectedYear].counts.positive, this.state.yearly[this.state.selectedYear].counts.negative],
                        }}
                        type="Bar"
                        options={{
                          seriesBarDistance: 10,
                          axisX: {
                            showGrid: false,
                          },
                          height: "245px",
                        }}
                        responsiveOptions={[
                          [
                            "screen and (max-width: 640px)",
                            {
                              seriesBarDistance: 5,
                              axisX: {
                                labelInterpolationFnc: function (value) {
                                  return value[0];
                                },
                              },
                            },
                          ],
                        ]}
                      />
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <div className="legend">
                    {/* <i class="fas fa-info-square"></i> Positive 
                      &nbsp;
                      <i className="fas fa-square text-danger"></i> Negative */}
                      <strong>Positive:</strong> <span style={{ backgroundColor: "#1DC7EA", width: "20px", height: "20px", display: "inline-block", marginRight: "10px" }}></span>
                      <strong>Negative:</strong> <span style={{ backgroundColor: "#FB404B", width: "20px", height: "20px", display: "inline-block" }}></span>
                    </div>
                    <hr></hr>
                    <div className="stats">
                      Data information certified
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
              <Col md="4">
                <Card>
                  <Card.Header>
                    <Card.Title as="h4">Overall Sentiment</Card.Title>
                    {/* <p className="card-category">Last Campaign Performance</p> */}
                  </Card.Header>
                  <Card.Body>
                    <div
                      className="ct-chart ct-perfect-fourth"
                      id="chartPreferences"
                    >
                      <ChartistGraph
                        data={{
                          labels: [this.state.overall.positive_percentage+"%", this.state.overall.negative_percentage+"%"],
                          series: [this.state.overall.positive_percentage, this.state.overall.negative_percentage]
                        }}
                        type="Pie"
                        options={{
                          donut: true,
                        }}
                      />
                    </div>
                    <center>
                    <div className="legend">
                    <strong>Positive:</strong> <span style={{ backgroundColor: "#1DC7EA", width: "20px", height: "20px", display: "inline-block", marginRight: "10px" }}></span>
                      <strong>Negative:</strong> <span style={{ backgroundColor: "#FB404B", width: "20px", height: "20px", display: "inline-block" }}></span>
                    </div>
                    </center>
                  </Card.Body>
                  <Card.Footer>
                    <hr></hr>
                    <div className="stats">
                      <i className="far fa-calendar-alt mr-1"></i>
                      Reviews Insight using Sentiment Analysis
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Card>
                  <Card.Header>
                    <Card.Title as="h4">Reviews Processed</Card.Title>
                    <p className="card-category">Monthly Reviews Count</p>
                  </Card.Header>
                  <Card.Body>
                    <div className="ct-chart" id="chartHours">
                      <ChartistGraph
                        data={{
                          labels: this.state.yearly[this.state.selectedYear].months,
                          series: [
                            [],
                            [],
                            this.state.yearly[this.state.selectedYear].counts.total,
                          ],
                        }}
                        type="Line"
                        options={{
                          low: 0,
                          high: 1800,
                          showArea: false,
                          height: "245px",
                          axisX: {
                            showGrid: false,
                          },
                          lineSmooth: true,
                          showLine: true,
                          showPoint: true,
                          fullWidth: false,
                          chartPadding: {
                            right: 50,
                          },
                        }}
                        responsiveOptions={[
                          [
                            "screen and (max-width: 640px)",
                            {
                              axisX: {
                                labelInterpolationFnc: function (value) {
                                  return value[0];
                                },
                              },
                            },
                          ],
                        ]}
                      />
                    </div>
                    <div className="legend">
                      {/* <i className="fas fa-square text-info"></i>Open
                      <i className="fas fa-square text-danger"></i>Click  */}
                      {/* <i className="fas fa-square text-warning"></i> Reviews Count */}
                    </div>
                  </Card.Body>
                </Card>
              </Col> 
            </Row>
            <Row>
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Recent Requests</Card.Title>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-0">ID</th>
                        <th className="border-0">Time</th>
                        <th className="border-0">Reviews</th>
                        <th className="border-0">Positive</th>
                        <th className="border-0">Negative</th>
                        <th className="border-0">Request Type</th>
                        <th className="border-0">Delivery Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.recent.map((row, idx) => {
                          return (
                          <tr key={idx}>
                            <td>{row.request_id}</td>
                            <td>{row.time}</td>
                            <td>{row.reviews}</td>
                            <td>{row.positive}</td>
                            <td>{row.negative}</td>
                            <td>{row.request_type}</td>
                            <td>{row.delivery_method}</td>
                          </tr>)
                        })
                      }
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col> 
            </Row>
          </Container>
        </>
      );

    }
  }
}

export default Dashboard;