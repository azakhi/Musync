import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from "axios";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faMusic, faGuitar, faUser, faChevronLeft,
  faPlus, faArrowUp, faGlassMartini, faSlidersH,
  faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import App from './App';


// Add Font Awesome Icons to library here.
library.add(fab, faMusic, faGuitar, faUser,
  faChevronLeft, faPlus, faArrowUp, faGlassMartini, faSlidersH,
  faExclamationTriangle, faCheckCircle);

// Need this to add CORS headers
axios.defaults.withCredentials = true;

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
