require('dotenv').config();

const env = process.env.NODE_ENV || "dev";

const dev = {
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: parseInt(process.env.DEV_DB_PORT) || 27017,
    name: process.env.DEV_DB_NAME || 'musync',
    user: process.env.DEV_DB_USER || '',
    pass: process.env.DEV_DB_PASS || ''
  },
  spotify: {
    clientID: process.env.DEV_SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.DEV_SPOTIFY_CLIENT_SECRET || '',
    scopes: process.env.DEV_SPOTIFY_SCOPES || 'user-library-modify playlist-read-private user-read-email playlist-modify-public playlist-modify-private user-library-read user-read-playback-state user-modify-playback-state user-top-read user-read-currently-playing',
    playlistName: process.env.DEV_SPOTIFY_PLAYLIST_NAME || 'MusyncPlaylist',
    playlistDecription: process.env.DEV_SPOTIFY_PLAYLIST_DESC || 'This playlist is created automatically by Musync',
  }
};

const test = {
  db: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT) || 27017,
    name: process.env.TEST_DB_NAME || 'musync_test',
    user: process.env.TEST_DB_USER || '',
    pass: process.env.TEST_DB_PASS || ''
  },
  spotify: {
    clientID: process.env.TEST_SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.TEST_SPOTIFY_CLIENT_SECRET || '',
    scopes: process.env.TEST_SPOTIFY_SCOPES || 'user-library-modify playlist-read-private user-read-email playlist-modify-public playlist-modify-private user-library-read user-read-playback-state user-modify-playback-state user-top-read user-read-currently-playing',
    playlistName: process.env.TEST_SPOTIFY_PLAYLIST_NAME || 'MusyncPlaylist',
    playlistDecription: process.env.TEST_SPOTIFY_PLAYLIST_DESC || 'This playlist is created automatically by Musync',
  }
};

const config = {
  dev,
  test
};

module.exports = config[env];