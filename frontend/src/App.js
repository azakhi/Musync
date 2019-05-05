import React, {Component} from 'react';
import {Route, Switch} from "react-router-dom";

import Home from "./Components/Home/Home";
import Place from "./Components/Place/Place";
import User from "./Components/User/User";
import SignUp from "./Components/User/SignUp";
import Login from "./Components/User/Login";
import CreatePlace from "./Components/Place/CreatePlace";
import SpotifyCallback from "./spotify/SpotifyCallback";
import NotFound from "./Components/Utils/NotFound";
import PlaceSettings from './Components/Place/PlaceSettings';
import UserSettings from './Components/User/UserSettings';
import Places from './Components/Places/Places';

class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/place/settings' component={PlaceSettings}/>
          <Route exact path='/place/:id' component={Place}/>
          <Route exact path='/user/settings' component={UserSettings}/>
          <Route exact path='/user/:id' component={User}/>
          <Route exact path='/register' component={SignUp}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/create-place' component={CreatePlace}/>
          <Route exact path='/spotifyCallback' component={SpotifyCallback}/>
          <Route exact path='/allplaces' component={Places}/>
          <Route path='/' component={NotFound}/>
        </Switch>
      </main>
    );
  }
}

export default App;
