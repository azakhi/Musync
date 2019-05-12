import React, {Component} from "react";
import axios from "axios";
import history from "../utils/history"

import {
  CONNECT_PLACE_URL, CONNECT_SPOTIFY_URL, CREATE_PLACE_URL,
  GET_PLACE_URL, GET_USER_PROFILE_URL,
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
      this.requestUserInfo = this.requestUserInfo.bind(this);
      this.cancelWithAuthCalls = this.cancelWithAuthCalls.bind(this);
      this.logout = this.logout.bind(this);
      this.login = this.login.bind(this);
      this.loginWithSpotify = this.loginWithSpotify.bind(this);
      this.connectToPlace = this.connectToPlace.bind(this);
      this.createPlace = this.createPlace.bind(this);
      this.checkCreatePlace = this.checkCreatePlace.bind(this);
      
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
          const user = response.data;
          
          this.setState({
            authFailed: false,
            isAuthenticated: user.isRegistered,
            authUser: user,
            connectedPlace: user.connectedPlace
          });
          
          if(type === 'login' && user.isRegistered)
            history.push('/');
          else if(type === 'user_settings' && !user.isRegistered)
            history.push({
              pathname: "/login",
              state: { from: "/user/settings" }
            });
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
          
          if(type === 'user_settings')
            history.push({
              pathname: "/login",
              state: { from: "/user/settings" }
            });
        })
        .finally(() => {
          if(type === 'createPlace')
            this.checkCreatePlace();
        })
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
    
    requestUserInfo(userId) {
      const url = GET_USER_PROFILE_URL + `?userId=${userId}`;
      axios.get(url, { cancelToken: this.state.source.token })
        .then(response => {
          this.setState({
            user: response.data
          });
        })
        .catch(error => {
          if(axios.isCancel(error)){
            console.log(error);
            return;
          }
          
          this.cancelWithAuthCalls("User does not exist.");
          history.push("/");
        });
    }
    
    async login(credentials, nextPath) {
      this.setState({ loading: true, loginAttempted: true, authFailed: false });
      
      if(this.state.authUser && !this.state.authUser.isRegistered)
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
    
    loginWithSpotify(spotifyCode, historyObj, spotifyType) {
      let callbackUrl = USER_REGISTER_URL;
      
      if(spotifyType === "login")
        callbackUrl = USER_LOGIN_URL;
      else if(spotifyType === "connect")
        callbackUrl = CONNECT_SPOTIFY_URL;
      
      const url = SPOTIFY_CALLBACK_URL + "?code=" + spotifyCode;
      axios.get(url, { cancelToken: this.state.source.token })
        .then(() => {
          axios.get(callbackUrl);
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
    
    createPlace(payload) {
      axios.post(CREATE_PLACE_URL, payload, { cancelToken: this.state.source.token })
        .then(response => {
          const place = response.data;
          history.push("/place/" + place._id);
        })
        .catch(error => {
          console.log(error, error.response);
        });
    }
    
    checkCreatePlace() {
      const {isAuthenticated, authUser} = this.state;
      if(!isAuthenticated || (authUser && !authUser.isRegistered)){
        console.log("Authentication needed.");
        
        history.push({pathname: "/login", state: { from: window.location.pathname }});
      }
    }
    
    cancelWithAuthCalls(error) {
      this.state.source.cancel(error);
    }
    
    render() {
      const {isAuthenticated, authFailed, authUser,
        connectedPlace, place, errorMsg, loginAttempted, user} = this.state;
      
      const otherProps = {
        requestUserInfo: type === 'user' ? this.requestUserInfo : undefined,
        isOwner: type === 'place' && place && place.hasOwnProperty("owner"),
        user: type === 'user' ? user : undefined,
        createPlace: type === 'createPlace' ? this.createPlace : undefined
      };
      
      return <WrappedComponent authFailed={authFailed}
                               isAuthenticated={isAuthenticated}
                               authUser={authUser}
                               connectedPlace={connectedPlace}
                               login={this.login}
                               logout={this.logout}
                               loginWithSpotify={this.loginWithSpotify}
                               connectToPlace={this.connectToPlace}
                               requestPlaceInfo={this.requestPlaceInfo}
                               place={place}
                               errorMsg={errorMsg}
                               loginAttempted={loginAttempted}
                               {...otherProps}
                               {...this.props} />
    }
  }
  
  return withAuth;
};

export default withAuth;