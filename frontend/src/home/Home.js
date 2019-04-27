import React, {Component} from "react";

import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography/index";
import Footer from "../utils/Footer";
import auth from "../auth/auth";
import location from "../location/location";
import {Heading} from "../utils/Heading";
import {ButtomLinks} from "./ButtomLinks";
import {NearPlaces} from "./NearPlaces";
import CircularProgress from "@material-ui/core/CircularProgress";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Chip from "@material-ui/core/Chip";


class Home extends Component {
  
  constructor(props) {
    super(props);
    
    this.handleLogout = this.handleLogout.bind(this);
    
    this.state = {
      authenticated: false,
      authUser: null,
      locationPermission: true,
      loading: false,
      success: false,
      mainPlace: null,
      otherPlaces: null
    };
  }
  
  componentDidMount() {
    this.requestAuthUserInfo();
    this.getNearPlaces();
  }
  
  requestAuthUserInfo() {
    auth.requestUserInfo()
      .then(() => {
        this.setState({
          authenticated: true,
          authUser: auth.getAuthUser()
        })
      })
      .catch(() => {
        this.setState({
          authenticated: false,
          authUser: null
        })
      });
  }
  
  getNearPlaces() {
    this.setState({
      loading: true,
      success: false
    });
    
    location.getNearPlaces()
      .then(places => {
        this.setState({
          loading: false,
          success: true,
          locationPermission: true,
          mainPlace: places.mainPlace,
          otherPlaces: places.otherPlaces,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          success: false,
          locationPermission: false
        });
      });
  }
  
  handleLogout() {
    this.setState({
      authenticated: false,
      authUser: null
    })
  }
  
  render() {
    const {authUser, authenticated, mainPlace, otherPlaces,
      success, loading, locationPermission} = this.state;
    const errorIcon = <FontAwesomeIcon icon={"exclamation-triangle"}/>;
    
    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>
        
        <Heading />
        
        {
          authUser &&
          <Typography align="center" variant="subtitle1" color="textPrimary">
            {`Welcome back ${authUser.name}!`}
          </Typography>
        }
        
        { success && <NearPlaces mainPlace={mainPlace} otherPlaces={otherPlaces} />}
        
        { loading && <CircularProgress size={48}/>}
        
        {
          !locationPermission &&
          <Chip label="Please grant location permission!
          It is needed to locate near places."
                icon={errorIcon}
                color="secondary"
                variant="outlined"/>
        }
        
        <ButtomLinks authenticated={authenticated}
                     handleLogout={this.handleLogout}/>
        
        <Footer/>
      
      </Grid>
    );
  }
}

export default Home;