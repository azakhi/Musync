import React, {Component} from "react";
import Cookies from 'universal-cookie';

import auth from "../auth/auth";
import {getURLParamVal} from "../utils/utils";


class SpotifyCallback extends Component {
  constructor(props) {
    super(props);
  
    const {history} = props;
    const {code, redirected, accessGiven} = handleSpotifyRedirection();
    
    const {path, error} = findNextPath(redirected, accessGiven);
    const historyObj = {
      pathname: path,
      state: { spotifyDenied: error }
    };
    
    if(redirected && accessGiven) {
      auth.loginWithSpotify(code)
        .catch(error =>
          historyObj.state.spotifyDenied = error.response ?
            error.response.data : "Network error."
        )
        .finally(() => history.push(historyObj));
    }
    else {
      history.push(historyObj);
    }
  }
  
  render() {
    return <div>Redirecting to Musync...</div>;
  }
}

export default SpotifyCallback;


function handleSpotifyRedirection() {
  const code = getURLParamVal("code");
  const error = getURLParamVal("error");
  const state  = getURLParamVal("state");
  
  const confirmState = checkStateParamCookie(state);
  let redirected = false;
  let accessGiven = false;
  if(error && confirmState){
    redirected = true;
  }
  else if(code && confirmState){
    redirected = true;
    accessGiven = true;
  }
  
  return {
    redirected: redirected,
    accessGiven: accessGiven,
    code: code
  };
}

function checkStateParamCookie(state) {
  const cookies = new Cookies();
  return state && cookies.get('state_param') === state;
}

function findNextPath(redirected, accessGiven) {
  const cookies = new Cookies();
  const fromPath = cookies.get("from_path");
  const nextPath = cookies.get("next_path");
  
  const defaultPath = '/';
  let path, error;
  if(redirected && !accessGiven){
    path = fromPath;
    error = "Spotify access denied!";
  }
  else if(redirected && accessGiven)
    path = nextPath;
  
  return {
    path: path || defaultPath,
    error: error
  };
}