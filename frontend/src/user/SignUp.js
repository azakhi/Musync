import React, {Component} from "react";
import axios from "axios";

import Button from "@material-ui/core/Button/index";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid/index";
import TextField from "@material-ui/core/TextField/index";
import Typography from "@material-ui/core/Typography/index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Footer from "../utils/Footer";
import {generateSpotifyAuthURL, SERVER_DOMAIN} from "../config";
import Chip from "@material-ui/core/Chip";


class SignUp extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      name: "",
      email: "",
      password: "",
      loading: false,
      success: false,
      error: false
    };
  }
  
  handleInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  
  handleSubmit(event) {
    this.setState({
      loading: true,
      success: false,
      error: false
    });
    
    const url = SERVER_DOMAIN + "/user/register";
    const body = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };
    
    axios.post(url, body)
      .then(response => {
        this.setState({
          loading: false,
          success: true,
          error: false
        });
        
        setTimeout(() => {
          this.props.history.push('/');
        }, 2000);
        
      })
      .catch(error => {
        this.setState({
          loading: false,
          success: false,
          error: true,
          errorMsg: error.response.data
        });
      });
    
    event.preventDefault();
  }
  
  render() {
    const {loading, error, errorMsg, success} = this.state;
    const errorIcon = <FontAwesomeIcon icon={"exclamation-triangle"}/>;
    const successIcon = <FontAwesomeIcon icon={"check-circle"}/>;
    const spotifyAuthURL = generateSpotifyAuthURL();
    
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
        
        <Grid item xs={12} style={{textAlign: 'center'}}>
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
            <div>
              <Button variant="text"
                      color="primary"
                      type="submit"
                      disabled={loading}>
                Sign Up
              </Button>
              <br/>
              {loading && <CircularProgress size={24}/>}
            </div>
          </form>
          
          {error && <Chip label={' ' + errorMsg}
                          icon={errorIcon}
                          color="secondary"
                          variant="outlined"/>}
  
          {success && <Chip label="Success! Get ready for musynchronization!"
                            icon={successIcon}
                            color="primary"
                            variant="outlined"/>}
                          
          <Typography align="center"
                      variant="caption"
                      color="textSecondary"
                      gutterBottom>
            or connect with
          </Typography>
          
          <Button variant="contained"
                  color="primary"
                  href={spotifyAuthURL}
                  disabled={loading}>
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