import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom';
import axios from "axios";
import history from './utils/history'

import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {library} from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {
  faArrowUp,
  faCheckCircle,
  faChevronLeft,
  faExclamationTriangle,
  faGlassMartini,
  faGuitar,
  faPause,
  faPlay,
  faPlus,
  faPoll,
  faSlidersH,
  faUser
} from '@fortawesome/free-solid-svg-icons'

import App from './App';
import CssBaseline from "@material-ui/core/CssBaseline";
import yellow from "@material-ui/core/es/colors/yellow";
import red from "@material-ui/core/es/colors/red";
import grey from "@material-ui/core/es/colors/grey";


// Add Font Awesome Icons to library here.
library.add(fab, faGuitar, faUser,
  faChevronLeft, faPlus, faArrowUp, faGlassMartini, faSlidersH,
  faExclamationTriangle, faCheckCircle, faPoll, faPlay, faPause);

// Need this to add CORS headers
axios.defaults.withCredentials = true;

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: yellow[500],
    },
    secondary: {
      main: grey[50],
    },
    error: red,
    text: {
      primary: grey[50],
      secondary: grey[400]
    }
  },
  typography: {
  
  },
});

ReactDOM.render((
  <Router history={history}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  </Router>
), document.getElementById('root'));
