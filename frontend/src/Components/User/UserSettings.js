import React, {Component} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Button from "@material-ui/core/Button/index";
import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography/index";
import TextField from "@material-ui/core/TextField/index";
import Footer from "../Utils/Footer";
import axios from "axios/index";
import {SERVER_DOMAIN} from "../../config";
import Navbar from "../Utils/Navbar";
import withAuth from "../../auth/withAuth";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";


class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.state = {
      name: "",
      email: "",
      currentPass: "",
      newPass: "",
      userInitialized: false,
      success: false,
      error: false
    };
  }
  
  handleInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  
  handleSubmit(){
    const url = SERVER_DOMAIN + "/user/update";
    const payload = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.currentPass,
      newPassword: this.state.newPass,
      location: null
    };
    
    axios.post(url, payload)
      .then(() => {
        this.setState({
          success: true,
          error: false
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          success: false,
          error: true
        });
      });
  }
  
  componentWillReceiveProps(nextProps, nextContext) {
    if(!this.state.userInitialized && nextProps.isAuthenticated){
      this.setState({
        userInitialized: true,
        name: nextProps.authUser.name,
        email: nextProps.authUser.email
      })
    }
  }
  
  render() {
    const buttonStyle = {
      marginTop: "3%"
    };
    const {success, error} = this.state;
    
    const errorIcon = <FontAwesomeIcon icon={"exclamation-triangle"}/>;
    const successIcon = <FontAwesomeIcon icon={"check-circle"}/>;
    
    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>
        
        <Navbar />
        
        <Grid item xs={12} style={{textAlign: 'center'}}>
          <Typography variant="h5"
                      color="textPrimary">
            Settings
          </Typography>
          
          <TextField id="name"
                     label="Name"
                     onChange={this.handleInputChange}
                     style={{ margin: 8 }}
                     placeholder= "Change name..."
                     value={this.state.name} />
          <br/>
          
          <TextField id="email"
                     label="E-mail address"
                     onChange={this.handleInputChange}
                     style={{ margin: 8 }}
                     placeholder= "Change email..."
                     value={this.state.email} />
          <br/>
          
          <TextField id="currentPass"
                     label="Current Password"
                     type ="password"
                     onChange={this.handleInputChange}
                     value={this.state.currentPass}
                     style={{ margin: 8 }} />
          <br/>
          
          <TextField id="newPass"
                     label="New Password"
                     type ="password"
                     onChange={this.handleInputChange}
                     value={this.state.newPass}
                     style={{ margin: 8 }} />
          <br/>
          
          <Button variant="contained"
                  color="primary"
                  type="submit" onClick={this.handleSubmit}
                  style={buttonStyle}>
            Apply
          </Button>
          <br/>
          <Button variant="text"
                  color="primary"
                  onClick={() => this.props.history.goBack()}
                  style={buttonStyle}>
            Go back
          </Button>
          <br/>
          {
            success &&
            <Chip label="Success! Changes are saved."
                  icon={successIcon}
                  color="primary"
                  variant="outlined"/>
          }
  
          {
            error &&
            <Chip label="Error! Something went wrong."
                  icon={errorIcon}
                  color="secondary"
                  variant="outlined"/>
          }
          
          <Divider style={{marginBottom: "5%"}}/>
          
          <Typography align="center"
                      variant="caption"
                      color="textSecondary"
                      gutterBottom>
            Connect your Spotify account
          </Typography>
          
          <Button variant="contained"
                  color="primary"
                  href={"ads"}
                  style={{marginBottom: "2%"}}>
            <FontAwesomeIcon icon={["fab", "spotify"]} size="lg"/>&nbsp;
            Spotify
          </Button>
          <br/>
        
        </Grid>
        <Footer />
      </Grid>
    );
  }
}
export default withAuth(UserSettings, "user_settings");
