export const SERVER_DOMAIN = "http://localhost:1234";
export const SPOTIFY_INFO = {
  clientID: '...',
  clientSecret: '...',
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

export function generateSpotifyAuthURL(){
  let url = "https://accounts.spotify.com/authorize?";
  let options = {
    client_id: SPOTIFY_INFO.clientID,
    redirect_uri: encodeURIComponent("http://localhost:1234/callback"),
    scope: encodeURIComponent(SPOTIFY_INFO.scopes),
    response_type: "code",
    show_dialog: true
  };
  
  for(const key in options){
    url += `&${key}=${options[key]}`;
  }
  
  return url;
}