import React, {Component} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import auth from "../auth/auth";
import Footer from "../utils/Footer";
import {generateSpotifyAuthURL} from "../config";
import {generateStateParamCookie, setNextAndCurrPathCookies} from "../utils/utils";
import {Heading} from "../utils/Heading";


class Login extends Component {
  constructor(props) {
    super(props);
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  
    const {history, location} = props;
    const spotifyDenied = location.state ? location.state.spotifyDenied : false;
    const nextPath = location.state ? location.state.from : "/";
    setNextAndCurrPathCookies(nextPath);
    
    // Check if already authenticated
    if(auth.isAuthenticated()){
      history.push(nextPath);
    }
  
    this.state = {
      email: "",
      password: "",
      stateParam: generateStateParamCookie(),
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
    
    const credentials = {
      email: this.state.email,
      password: this.state.password
    };
    
    auth.login(credentials)
      .then(() => {
        this.setState({
          loading: false,
          success: true,
          error: false
        });

        this.props.history.push(this.state.nextPath);
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
            Login
          </Typography>
          
          <form onSubmit={this.handleSubmit}>
            <TextField required
                       id="email"
                       label="Email"
                       onChange={this.handleInputChange}
                       margin="dense"/>
            <br/>
            <TextField required
                       id="password"
                       label="Password"
                       type="password"
                       onChange={this.handleInputChange}
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
          <br/>
          
          {spotifyDenied && <Chip label="Please grant us Spotify access :("
                                  icon={errorIcon}
                                  color="secondary"
                                  variant="outlined"/>}
          
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