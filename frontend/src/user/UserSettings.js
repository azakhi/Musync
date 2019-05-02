import React, {Component} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Footer from "../utils/Footer";
import {Heading} from "../utils/Heading";
import axios from "axios";
import {SERVER_DOMAIN} from "../config";

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: null,
      email: null,
      currentPass: null,
      newPass: null
    };
  }

  handleInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
    console.log(this.state);
  }

  handleSubmit(event){
    const url = SERVER_DOMAIN + "/user/update";
    let self = this;
    axios.post(url, {
      name: this.state.name,
      email: this.state.email,
      password: this.state.currentPass,
      newPassword: this.state.newPass,
      location: null
    })
      .then(function (response) {
        if( response.status === 200 ){
          console.log("Success");
        }
        else{
          console.log(response.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    const url = SERVER_DOMAIN + "/user/checkconnection";
    let self = this;
    axios.get(url)
      .then(function (response) {
        if( response.data.isLoggedIn ){
          const secondUrl = SERVER_DOMAIN + "/user/";
          axios.get(secondUrl)
            .then(function (secondResponse) {
              if( secondResponse.status === 200 ){
                self.setState({ name: secondResponse.data.name});
                self.setState({ email: secondResponse.data.email});
              }
              else{
                window.location.href = "/../login";
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        else{
          window.location.href = "/../login";
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const {loading, error, errorMsg, success, stateParam, spotifyDenied} = this.state;
    const errorIcon = <FontAwesomeIcon icon={"exclamation-triangle"}/>;
    const successIcon = <FontAwesomeIcon icon={"check-circle"}/>;

    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>

        <Heading />
        <Grid item xs={12} style={{textAlign: 'center'}}>
          <Typography variant="h5"
                      color="textPrimary">
            Settings
          </Typography>

          <form onSubmit={this.handleSubmit}>
            <TextField
                       id="name"
                       label="Name"
                       onChange={this.handleInputChange}
                       style={{ margin: 8 }}
                       placeholder= {this.state.name}
                       value={this.state.name}
                       fullWidth
                       margin="normal"
                       InputLabelProps={{
                         shrink: true,
                       }}
                />
            <br/>

            <TextField
                       id="email"
                       label="E-mail Address"
                       onChange={this.handleInputChange}
                       style={{ margin: 8 }}
                       placeholder= {this.state.email}
                       value={this.state.email}
                       fullWidth
                       margin="normal"
                       InputLabelProps={{
                         shrink: true,
                       }}
                />
            <br/>

            <TextField
                       id="currentPass"
                       label="Current Password"
                       type ="password"
                       onChange={this.handleInputChange}
                       value={this.state.currentPass}
                       style={{ margin: 8 }}
                       fullWidth
                       margin="normal"
                       InputLabelProps={{
                         shrink: true,
                       }}
                />
            <br/>

            <TextField
                       id="newPass"
                       label="New Password"
                       type ="password"
                       onChange={this.handleInputChange}
                       value={this.state.newPass}
                       style={{ margin: 8 }}
                       fullWidth
                       margin="normal"
                       InputLabelProps={{
                         shrink: true,
                       }}
                />
            <br/>

            <div>
              <Button
                      variant="text"
                      color="primary"
                      type="submit"
                      disabled={loading}>
                Apply
              </Button>
              <br/>
            </div>
          </form>
          <br/>
        </Grid>
        <Footer />
      </Grid>
    );
  }
}
export default UserSettings;
