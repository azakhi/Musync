import React, {Component} from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Footer from "../utils/Footer";
import {generateSpotifyAuthURL, USER_LOGIN_URL} from "../config";
import {generateStateParamCookie, setNextAndCurrPathCookies} from "../utils/utils";


class Login extends Component {
  constructor(props) {
    super(props);
    
    const {location} = props;
    const spotifyDenied = location.state ? location.state.spotifyDenied : null;
    const nextPath = location.state ? location.state.from : "/";
  
    setNextAndCurrPathCookies(nextPath);
    const stateParam = generateStateParamCookie();
  
    this.state = {
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
      error: false
    });
    
    const body = {
      email: this.state.email,
      password: this.state.password
    };
    
    axios.post(USER_LOGIN_URL, body)
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
          errorMsg: error.response ? error.response.data : "Network error."
        });
      });
    
    event.preventDefault();
  }
  
  render() {
    const {loading, error, errorMsg, success, stateParam} = this.state;
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
            Login
          </Typography>
          
          <form onSubmit={event => this.handleSubmit(event)}>
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
                Login
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
          
          <Typography align="center"
                      variant="body1"
                      color="textSecondary" style={{marginTop: "7%"}}>
            Don't have an account?&nbsp;
            <Link href="/register">Sign Up</Link>
          </Typography>
        </Grid>
        
        <Footer style={{position: "fixed", bottom: "5%"}}/>
      
      </Grid>
    );
  }
}

export default Login;