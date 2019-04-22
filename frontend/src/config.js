export const SERVER_DOMAIN = "http://localhost:1234";
export const SPOTIFY_INFO = {
  clientID: '...',
  scopes: 'user-library-modify ' +
    'playlist-read-private ' +
    'user-read-email ' +
    'playlist-modify-public ' +
    'playlist-modify-private ' +
    'user-library-read ' +
    'user-read-playback-state ' +
    'user-modify-playback-state ' +
    'user-top-read ' +
    'user-read-currently-playing',
};

export function generateSpotifyAuthURL(redirectURI, stateParam) {
  let url = "https://accounts.spotify.com/authorize?";
  let options = {
    client_id: SPOTIFY_INFO.clientID,
    redirect_uri: encodeURIComponent(redirectURI),
    scope: encodeURIComponent(SPOTIFY_INFO.scopes),
    response_type: "code",
    show_dialog: false,
    state: stateParam
  };
  
  for(const key in options){
    url += `&${key}=${options[key]}`;
  }
  
  return url;
}

export function getCurrentURL() {
  return window.location.protocol + "//" +
    window.location.host + window.location.pathname;
}

export function getURLParamVal(paramKey) {
  const url = window.location.href;
  return new URL(url).searchParams.get(paramKey);
}