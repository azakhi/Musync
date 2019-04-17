import React, {Component} from 'react';
import {Route, Switch} from "react-router-dom";

import './stylesheet/App.css';
import Home from "./Home";
import Place from "./place/Place";
import User from "./User";
import SignUp from "./SignUp";
import NotFound from "./NotFound";


class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/place' component={Place}/>
          <Route exact path='/user' component={User}/>
          <Route exact path='/signup' component={SignUp}/>
          <Route path='/' component={NotFound}/>
        </Switch>
      </main>
    );
  }
}

export default App;
