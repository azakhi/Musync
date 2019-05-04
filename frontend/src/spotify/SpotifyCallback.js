import React, {Component} from "react";
import Cookies from 'universal-cookie';

import {getURLParamVal} from "../utils/utils";
import history from "../utils/history";
import withAuth from "../auth/withAuth";


class SpotifyCallback extends Component {
  constructor(props) {
    super(props);
  
    const {code, redirected, accessGiven} = handleSpotifyRedirection();
    
    const {path, error, spotifyType} = findNextPath(redirected, accessGiven);
    const historyObj = {
      pathname: path,
      state: { spotifyDenied: error }
    };
    
    if(redirected && accessGiven)
      props.loginWithSpotify(code, historyObj, spotifyType);
    else
      history.push(historyObj);
  }
  
  render() {
    return <div>Redirecting to Musync...</div>;
  }
}

export default withAuth(SpotifyCallback);


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
  const spotifyType = cookies.get("spotify_type");

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
    error: error,
    spotifyType: spotifyType
  };
}