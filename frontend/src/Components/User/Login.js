import React, {Component} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Button from "@material-ui/core/Button/index";
import Chip from "@material-ui/core/Chip/index";
import CircularProgress from "@material-ui/core/CircularProgress/index";
import Grid from "@material-ui/core/Grid/index";
import Link from "@material-ui/core/Link/index";
import Typography from "@material-ui/core/Typography/index";
import TextField from "@material-ui/core/TextField/index";
import Footer from "../Utils/Footer";
import {generateSpotifyAuthURL} from "../../config";
import {generateStateParamCookie, setNextAndCurrPathCookies, setSpotifyTypeCookie} from "../../utils/utils";
import {Heading} from "../Utils/Heading";
import withAuth from "../../auth/withAuth";


class Login extends Component {
  constructor(props) {
    super(props);
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  
    const {location} = props;
    const spotifyDenied = location.state ? location.state.spotifyDenied : false;
    const nextPath = location.state ? location.state.from : "/";
    setNextAndCurrPathCookies(nextPath);
    setSpotifyTypeCookie("login");
    
    this.state = {
      email: "",
      password: "",
      stateParam: generateStateParamCookie(),
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
    const credentials = {
      email: this.state.email,
      password: this.state.password
    };
    
    this.props.login(credentials, this.state.nextPath);
    
    event.preventDefault();
  }
  
  render() {
    const {loading, authFailed, errorMsg, isAuthenticated, loginAttempted} = this.props;
    const {stateParam, spotifyDenied} = this.state;
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
          
          {
            (loginAttempted && authFailed) &&
            <Chip label={' ' + errorMsg}
                  icon={errorIcon}
                  color="secondary"
                  variant="outlined"/>}
          
          {isAuthenticated && <Chip label="Success! Get ready for musynchronization!"
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

export default withAuth(Login, 'login');