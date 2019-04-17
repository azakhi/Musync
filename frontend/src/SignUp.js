import React, {Component} from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Footer from "./Footer";


class SignUp extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      emailValue: "",
      passwordValue: ""
    };
  }
  
  handleEmailChange(event) {
    this.setState({
      emailValue: event.target.value
    });
    
    console.log(event.target.value);
  }
  
  handlePasswordChange(event) {
    this.setState({
      passwordValue: event.target.value
    });
    
    console.log(event.target.value);
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
                      color="textPrimary"
                      align="left">
            Create an account
          </Typography>
          
          <form style={{textAlign: "center"}}>
            <TextField required
                       id="email"
                       label="Email"
                       autoComplete="current-email"
                       onChange={e => this.handleEmailChange(e)}
                       margin="normal"/>
            <br/>
            <TextField required
                       id="password"
                       label="Password"
                       type="password"
                       autoComplete="current-password"
                       onChange={e => this.handlePasswordChange(e)}
                       margin="normal"/>
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