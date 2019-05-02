import React, {Component} from 'react';
import {Route, Switch} from "react-router-dom";

import Home from "./home/Home";
import Place from "./place/Place";
import User from "./user/User";
import SignUp from "./user/SignUp";
import Login from "./user/Login";
import CreatePlace from "./place/CreatePlace";
import SpotifyCallback from "./spotify/SpotifyCallback";
import NotFound from "./utils/NotFound";
import PlaceSettings from './place/PlaceSettings';
import UserSettings from './user/UserSettings';

class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/place/:id' component={Place}/>
          <Route exact path='/user' component={User}/>
          <Route exact path='/register' component={SignUp}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/create-place' component={CreatePlace}/>
          <Route exact path='/placeSettings' component={PlaceSettings}/>
          <Route exact path='/spotifyCallback' component={SpotifyCallback}/>
          <Route exact path='/usersettings' component={UserSettings}/>
          <Route path='/' component={NotFound}/>
        </Switch>
      </main>
    );
  }
}

export default App;
