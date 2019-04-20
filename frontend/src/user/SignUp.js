import React, {Component} from "react";
import axios from "axios";

import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography/index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import TextField from "@material-ui/core/TextField/index";
import Button from "@material-ui/core/Button/index";
import Footer from "../utils/Footer";
import {SERVER_DOMAIN} from "../config";

class SignUp extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      name: "",
      email: "",
      password: ""
    };
  }
  
  handleInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  
  handleSubmit(event) {
    const url = SERVER_DOMAIN + "/register";
    const body = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };
    
    axios.post(url, body)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      });
    
    event.preventDefault();
  }
  
  render() {
    
    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>
        
        <Grid item xs={10}>
          <Typography variant="h2" align="center">
            <FontAwesomeIcon icon="guitar"/>
            Musync
          </Typography>
          
          <Typography align="center" gutterBottom>
            Start listening what you want to listen
          </Typography>
        </Grid>
        
        <Grid item xs={12} style={{textAlign: "center"}}>
          <Typography variant="h5"
                      color="textPrimary">
            Create an account
          </Typography>
          
          <form onSubmit={event => this.handleSubmit(event)}>
            <TextField required
                       id="name"
                       label="Name"
                       onChange={event => this.handleInputChange(event)}
                       margin="dense"/>
            <br/>
            <TextField required
                       id="email"
                       label="Email"
                       onChange={event => this.handleInputChange(event)}
                       margin="dense"/>
            <br/>
            <TextField required
                       id="password"
                       label="Password"
                       type="password"
                       onChange={event => this.handleInputChange(event)}
                       margin="dense"/>
            <br/>
            
            <Button variant="text"
                    color="primary"
                    type="submit">
              Sign Up
            </Button>
          </form>
          
          <Typography align="center"
                      variant="caption"
                      color="textSecondary"
                      gutterBottom>
            or connect with
          </Typography>
          
          <Button variant="contained"
                  color="primary">
            <FontAwesomeIcon icon={["fab", "spotify"]} size="lg"/>&nbsp;
            Spotify
          </Button>
          
        </Grid>
        
        <Footer style={{position: "fixed", bottom: "5%"}}/>
        
      </Grid>
    );
    
  }
}

export default SignUp;