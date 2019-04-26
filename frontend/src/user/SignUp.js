import React, {Component} from "react";
import axios from "axios";

import Button from "@material-ui/core/Button/index";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid/index";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField/index";
import Typography from "@material-ui/core/Typography/index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Footer from "../utils/Footer";
import {generateSpotifyAuthURL, USER_REGISTER_URL} from "../config";
import {generateStateParamCookie, setNextAndCurrPathCookies} from "../utils/utils";
import {Heading} from "../utils/Heading";


class SignUp extends Component {
  
  constructor(props) {
    super(props);
    
    const {location} = props;
    const spotifyDenied = location.state ? location.state.spotifyDenied : null;
    const nextPath = location.state ? location.state.from : "/";
    
    setNextAndCurrPathCookies(nextPath);
    const stateParam = generateStateParamCookie();
    
    this.state = {
      name: "",
      email: "",
      password: "",
      stateParam: stateParam,
      loading: false,
      success: false,
      error: false,
      errorMsg: "",
      spotifyDenied: spotifyDenied,
      nextPath: nextPath
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
      error: false,
      spotifyDenied: false
    });
    
    const url = USER_REGISTER_URL;
    const body = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };
    
    axios.post(url, body)
      .then(() => {
        this.setState({
          loading: false,
          success: true,
          error: false
        });
        
        setTimeout(() => {
          this.props.history.push(this.state.nextPath);
        }, 1000);
        
      })
      .catch(error => {
        this.setState({
          loading: false,
          success: false,
          error: true,
          errorMsg: error.response ? error.response.data : error
        });
      });
    
    event.preventDefault();
  }
  
  render() {
    const {loading, error, errorMsg, success, stateParam, spotifyDenied} = this.state;
    const errorIcon = <FontAwesomeIcon icon={"exclamation-triangle"}/>;
    const successIcon = <FontAwesomeIcon icon={"check-circle"}/>;
    const spotifyAuthURL = generateSpotifyAuthURL(stateParam);
    
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
                  disabled={loading}
                  style={{marginBottom: "2%"}}>
            <FontAwesomeIcon icon={["fab", "spotify"]} size="lg"/>&nbsp;
            Spotify
          </Button>
          
          {spotifyDenied && <Chip label="Please grant us Spotify access, we will behave"
                                  icon={errorIcon}
                                  color="secondary"
                                  variant="outlined"/>}
                                  
          <Typography align="center"
                      variant="body1"
                      color="textSecondary" style={{marginTop: "7%"}}>
            Have an account?&nbsp;
            <Link href="/login">Login</Link>
          </Typography>
         
        </Grid>
        
        <Footer style={{position: "fixed", bottom: "5%"}}/>
        
      </Grid>
    );
    
  }
}

export default SignUp;
