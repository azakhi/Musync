import React, {Component} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Chip from "@material-ui/core/Chip/index";
import CircularProgress from "@material-ui/core/CircularProgress/index";
import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography/index";

import Footer from "../Utils/Footer";
import location from "../../location/location";
import {Heading} from "../Utils/Heading";
import ButtomLinks from "./ButtomLinks";
import {NearPlaces} from "./NearPlaces";
import ConnectPlaceDialog from "./ConnectPlaceDialog";
import withAuth from "../../auth/withAuth";
import Link from "@material-ui/core/Link";


class Home extends Component {
  
  constructor(props) {
    super(props);
    
    this.handleLogout = this.handleLogout.bind(this);
    this.handleConnectPlace = this.handleConnectPlace.bind(this);
    this.handleConnectPlaceClose = this.handleConnectPlaceClose.bind(this);
    
    this.state = {
      locationPermission: true,
      loading: false,
      success: false,
      connectPlaceState: false,
      mainPlace: null,
      otherPlaces: null
    };
  }
  
  componentDidMount() {
    this.getNearPlaces();
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
  
  handleConnectPlace(id, name) {
    this.setState({
      connectPlaceId: id,
      connectPlaceName: name,
      connectPlaceState: true
    });
  }
  
  handleConnectPlaceClose() {
    this.setState({
      connectPlaceId: null,
      connectPlaceName: null,
      connectPlaceState: false
    });
  }
  
  render() {
    const {mainPlace, otherPlaces, success, loading, locationPermission,
      connectPlaceId, connectPlaceName, connectPlaceState} = this.state;
    const {authUser, isAuthenticated} = this.props;
    const errorIcon = <FontAwesomeIcon icon={"exclamation-triangle"}/>;
    const userIcon = <FontAwesomeIcon icon={"user"}/>;

    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>
        <Heading />
        
        {
          (isAuthenticated && authUser) &&
          <Link href={"/user/" + authUser._id}>
            <Chip label={`Welcome back ${authUser.name}!`}
                  icon={userIcon}
                  color="primary"
                  variant="outlined"/>
          </Link>
        }
        
        {
          success &&
          <NearPlaces mainPlace={mainPlace}
                      otherPlaces={otherPlaces}
                      handleConnectPlace={this.handleConnectPlace} />
        }
        
        { loading && <CircularProgress size={48}/> }
        
        {
          !locationPermission &&
          <Chip label="Please grant location permission!
          It is needed to locate near places."
                icon={errorIcon}
                color="secondary"
                variant="outlined"/>
        }
        
        <ButtomLinks />
        
        <Footer/>
      
        <ConnectPlaceDialog open={connectPlaceState}
                            placeName={connectPlaceName}
                            placeId={connectPlaceId}
                            handleClose={this.handleConnectPlaceClose}/>
      </Grid>
    );
  }
}

export default withAuth(Home);