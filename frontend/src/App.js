import React, {Component} from 'react';
import {Route, Switch} from "react-router-dom";

import Home from "./Home";
import Place from "./place/Place";
import User from "./user/User";
import SignUp from "./user/SignUp";
import Login from "./user/Login";
import CreatePlace from "./place/CreatePlace";
import NotFound from "./utils/NotFound";
import SpotifyCallback from "./spotify/SpotifyCallback";


class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/place' component={Place}/>
          <Route exact path='/user' component={User}/>
          <Route exact path='/register' component={SignUp}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/create-place' component={CreatePlace}/>
          <Route exact path='/spotifyCallback' component={SpotifyCallback}/>
          <Route path='/' component={NotFound}/>
        </Switch>
      </main>
    );
  }
}

export default App;
