import React, {Component} from "react";
import axios from "axios";
import history from "../utils/history"

import {
  CONNECT_PLACE_URL,
  GET_PLACE_URL,
  GET_USER_URL,
  SPOTIFY_CALLBACK_URL, USER_LOGIN_URL,
  USER_LOGOUT_URL,
  USER_REGISTER_URL
} from "../config";


const withAuth = (WrappedComponent, type) => {
  class withAuth extends Component {
    constructor(props) {
      super(props);
      this.checkAuthentication = this.checkAuthentication.bind(this);
      this.requestPlaceInfo = this.requestPlaceInfo.bind(this);
      this.cancelWithAuthCalls = this.cancelWithAuthCalls.bind(this);
      this.logout = this.logout.bind(this);
      this.login = this.login.bind(this);
      this.loginWithSpotify = this.loginWithSpotify.bind(this);
      this.connectToPlace = this.connectToPlace.bind(this);
  
      this.state = {
        authFailed: false,
        isAuthenticated: false,
        loading: false,
        authUser: null,
        connectedPlace: null,
        source: axios.CancelToken.source()
      };
    }
    
    componentDidMount() {
      this.checkAuthentication();
    }
  
    checkAuthentication() {
      axios.get(GET_USER_URL, { cancelToken: this.state.source.token })
        .then(response => {
          console.log(response);
          const user = response.data;
          
          this.setState({
            authFailed: false,
            isAuthenticated: user && user.isRegistered,
            authUser: user,
            connectedPlace: user ? user.connectedPlace : null
          });
          
          if(type === 'login' && user.isRegistered)
            history.push('/');
        })
        .catch(error => {
          if(axios.isCancel(error)){
            console.log(error);
            return;
          }
          
          this.setState({
            authFailed: true,
            isAuthenticated: false,
            isRegistered: false,
            authUser: null,
            connectedPlace: null
          });
        });
    }
    
    requestPlaceInfo(placeId) {
      const url = GET_PLACE_URL + `?placeId=${placeId}`;
      axios.get(url, { cancelToken: this.state.source.token })
        .then(response => {
          this.setState({
            place: response.data
          });
        })
        .catch(error => {
          if(axios.isCancel(error)){
            console.log(error);
            return;
          }
          
          this.cancelWithAuthCalls("Place does not exist.");
          history.push("/");
        });
    }
    
    async login(credentials, nextPath) {
      this.setState({ loading: true, loginAttempted: true, authFailed: false });
      
      if(!this.state.authUser.isRegistered)
        await this.logout();
      
      axios.post(USER_LOGIN_URL, credentials, { cancelToken: this.state.source.token })
        .then(() => {
          history.push(nextPath);
        })
        .catch(error => {
          if(axios.isCancel(error)){
            console.log(error);
            return;
          }
          
          this.setState({
            authFailed: true,
            isAuthenticated: false,
            authUser: null,
            connectedPlace: null,
            errorMsg: error.response ? error.response.data : "Network error.",
            loading: false
          });
        });
    }
  
    loginWithSpotify(spotifyCode, historyObj) {
      const url = SPOTIFY_CALLBACK_URL + "?code=" + spotifyCode;
      axios.get(url, { cancelToken: this.state.source.token })
        .then(() => {
          axios.get(USER_REGISTER_URL);
        })
        .catch(error => {
          if(axios.isCancel(error)){
            console.log(error);
            return;
          }
          
          historyObj.state.spotifyDenied = error.response ?
            error.response.data : "Network error.";
        })
        .finally(() => history.push(historyObj));
    }
    
    logout() {
      axios.get(USER_LOGOUT_URL, { cancelToken: this.state.source.token })
        .then(() => {
          history.push("/");
          window.location.reload();
        })
        .catch(error => {
          console.log(error);
        });
    }
  
    connectToPlace(placeId, pin) {
      const url = CONNECT_PLACE_URL + `?placeId=${placeId}&pin=${pin}`;
      axios.get(url,{ cancelToken: this.state.source.token })
        .then(() => history.push("/place/" + placeId) )
        .catch(error => console.log(error) );
    }
    
    cancelWithAuthCalls(error) {
      this.state.source.cancel(error);
    }
    
    render() {
      const {isAuthenticated, authFailed, authUser,
        connectedPlace, place, errorMsg, loginAttempted} = this.state;
      
      const otherProps = {
        requestPlaceInfo: type === 'place' ? this.requestPlaceInfo : undefined,
        place: type === 'place' ? place : undefined,
        isOwner: type === 'place' && place && place.hasOwnProperty("owner"),
      };

      return <WrappedComponent authFailed={authFailed}
                               isAuthenticated={isAuthenticated}
                               authUser={authUser}
                               connectedPlace={connectedPlace}
                               login={this.login}
                               logout={this.logout}
                               loginWithSpotify={this.loginWithSpotify}
                               connectToPlace={this.connectToPlace}
                               errorMsg={errorMsg}
                               loginAttempted={loginAttempted}
                               {...otherProps}
                               {...this.props} />
    }
  }
  
  return withAuth;
};

export default withAuth;