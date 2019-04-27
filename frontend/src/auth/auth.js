import axios from "axios";

import {GET_USER_URL, SPOTIFY_CALLBACK_URL, USER_LOGIN_URL, USER_LOGOUT_URL} from "../config";


class Auth {
  constructor() {
    this.authenticated = false;
    this.authUser = null;
  }
  
  isAuthenticated() {
    return this.authenticated;
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
}

export default new Auth();