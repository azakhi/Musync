import React, {Component} from "react";
import Select from 'react-select'
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {GET_PLAYLISTS_URL} from "../../config";


class PlaylistPicker extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      options: [],
      source: axios.CancelToken.source()
    };
  }
  
  componentDidMount() {
    axios.get(GET_PLAYLISTS_URL, {cancelToken: this.state.source.token})
      .then(response => {
        const playlists = response.data;
        this.setState({
          options: playlists && playlists.splice(0, 50)
        });
      })
      .catch(error => {
        console.log(error.response)
      })
  }
  
  componentWillUnmount() {
    this.state.source.cancel();
  }
  
  render() {
    const options = this.state.options;
    
    return (
      <Grid item xs={12}>
        <Typography variant="body1" align="left" gutterBottom>Playlists</Typography>
        <Select placeholder="Select playlist..."
                name="playlists"
                onChange={this.props.onChange}
                options={options} />
        <br/>
      </Grid>
    );
  }
}

export default PlaylistPicker;