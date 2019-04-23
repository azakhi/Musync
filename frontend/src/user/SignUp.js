import React, {Component} from "react";
import axios from "axios";

import Button from "@material-ui/core/Button/index";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid/index";
import TextField from "@material-ui/core/TextField/index";
import Typography from "@material-ui/core/Typography/index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Footer from "../utils/Footer";
import {generateSpotifyAuthURL, getCurrentURL, getURLParamVal, SERVER_DOMAIN} from "../config";


class SignUp extends Component {
  
  constructor(props) {
    super(props);
    
    const {cookies, history} = props;
    const {redirected, accessGiven, stateParam, code} = handleSpotifyRedirection(cookies);
    
    if(redirected && accessGiven){
      const url = SERVER_DOMAIN + "/callback?code=" + code;
      axios.get(url)
        .then(response => {
          this.setState({
            loading: false,
            spotifyDenied: false,
            success: true
          });
  
          setTimeout(() => {
            history.push('/');
          }, 2000);
        })
        .catch(error => {
          this.setState({
            loading: false,
            spotifyDenied: true,
            stateParam: generateStateParamCookie(cookies)
          });
        });
    }
    
    this.state = {
      name: "",
      email: "",
      password: "",
      stateParam: stateParam,
      loading: redirected && accessGiven,
      spotifyDenied: redirected && !accessGiven,
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
    const {loading, error, errorMsg, success, stateParam, spotifyDenied} = this.state;
    const errorIcon = <FontAwesomeIcon icon={"exclamation-triangle"}/>;
    const successIcon = <FontAwesomeIcon icon={"check-circle"}/>;
    const spotifyAuthURL = generateSpotifyAuthURL(getCurrentURL(), stateParam);
    
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
                  disabled={loading}
                  style={{marginBottom: "2%"}}>
            <FontAwesomeIcon icon={["fab", "spotify"]} size="lg"/>&nbsp;
            Spotify
          </Button>
          
          {spotifyDenied && <Chip label="Please grant us Spotify access, we will behave"
                                  icon={errorIcon}
                                  color="secondary"
                                  variant="outlined"/>}
        </Grid>
        
        <Footer style={{position: "fixed", bottom: "5%"}}/>
        
      </Grid>
    );
    
  }
}

export default SignUp;

function handleSpotifyRedirection(cookies) {
  const code = getURLParamVal("code");
  const error = getURLParamVal("error");
  const state  = getURLParamVal("state");
  
  let redirected = false;
  let accessGiven = false;
  const confirmState = checkStateParamCookie(state, cookies);
  if(error && confirmState){
    redirected = true;
  }
  else if(code && confirmState){
    redirected = true;
    accessGiven = true;
  }
  
  let stateParam = null;
  if(!redirected || (redirected && !accessGiven))
    stateParam = generateStateParamCookie(cookies);
  
  return {
    redirected: redirected,
    accessGiven: accessGiven,
    stateParam: stateParam,
    code: code
  };
}

function generateStateParamCookie(cookies) {
  const state = Math.random().toString(36).substring(2, 15);
  cookies.set('state_param', state, { path: '/sign-up' });
  return state;
}

function checkStateParamCookie(state, cookies) {
  return state && cookies.get('state_param') === state;
}