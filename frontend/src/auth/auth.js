import axios from "axios";

import {
  CONNECT_PLACE_URL,
  GET_PLACE_URL,
  GET_USER_URL,
  SPOTIFY_CALLBACK_URL,
  USER_LOGIN_URL,
  USER_LOGOUT_URL
} from "../config";


class Auth {
  constructor() {
    this.authenticated = false;
    this.authUser = null;
    this.pin = null;
    
    this.checkLocalStorageForPin();
  }
  
  checkLocalStorageForPin() {
    this.pin = window.localStorage.getItem("pin_code");
  }
  
  setPin(pin) {
    this.pin = pin;
    window.localStorage.setItem("pin_code", pin);
  }
  
  getAuthUser() {
    return this.authUser;
  }
  
  login(credentials) {
    return new Promise((resolve, reject) => {
      axios.post(USER_LOGIN_URL, credentials)
        .then(() => this.requestUserInfo())
        .then(() => resolve())
        .catch(error => {
          this.authenticated = false;
          this.authUser = null;
          reject(error);
        });
    });
  }
  
  loginWithSpotify(spotifyCode) {
    const url = SPOTIFY_CALLBACK_URL + "?code=" + spotifyCode;
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(() => this.requestUserInfo())
        .then(() => resolve())
        .catch(error => {
          this.authenticated = false;
          this.authUser = null;
          reject(error);
        });
    });
  }
  
  logout() {
    this.authenticated = false;
    this.authUser = null;
    
    return new Promise((resolve, reject) => {
      axios.get(USER_LOGOUT_URL)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  requestUserInfo() {
    return new Promise((resolve, reject) => {
      axios.get(GET_USER_URL)
        .then(response => {
          this.authenticated = true;
          this.authUser = response.data;
          resolve(response);
        })
        .catch(error => {
          this.authenticated = false;
          this.authUser = null;
          reject(error);
        });
    });
  }
  
  requestPlaceInfo(placeId) {
    this.requestPlaceToken = axios.CancelToken.source();
    
    return new Promise((resolve, reject) => {
      const url = GET_PLACE_URL + `?placeId=${placeId}`;
      axios.get(url, { cancelToken: this.requestPlaceToken.token})
        .then(response => resolve(response))
        .catch(error => {
          if(axios.isCancel(error))
            console.log("Request place info has been cancelled.");
          else
            reject(error)
        });
    });
  }
  
  cancelRequestPlaceInfo() {
    this.requestPlaceToken.cancel();
  }
  
  connectToPlace(placeId, pin) {
    if(pin)
      this.setPin(pin);
    pin = this.pin;
    
    this.connectPlaceToken = axios.CancelToken.source();
    
    const url = CONNECT_PLACE_URL + `?placeId=${placeId}&pin=${pin}`;
    return new Promise((resolve, reject) => {
      axios.get(url,{ cancelToken: this.connectPlaceToken.token})
        .then(() => resolve())
        .catch(error => {
          if(axios.isCancel(error))
            console.log("Request place info has been cancelled.");
          else
            reject(error)
        });
    });
  }
  
  cancelConnectPlaceInfo() {
    this.connectPlaceToken.cancel();
  }
}

export default new Auth();