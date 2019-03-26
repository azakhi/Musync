import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faMusic, faGuitar } from '@fortawesome/free-solid-svg-icons'

import './stylesheet/index.css';
import App from './App';


// Add Font Awesome Icons to library here.
library.add(fab, faMusic, faGuitar);

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
