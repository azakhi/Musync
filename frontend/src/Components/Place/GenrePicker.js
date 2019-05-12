import React, {Component} from "react";
import Select from 'react-select'
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {GET_GENRES_URL} from "../../config";


class GenrePicker extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      options: [],
      source: axios.CancelToken.source()
    };
  }
  
  componentDidMount() {
    axios.get(GET_GENRES_URL, {cancelToken: this.state.source.token})
      .then(response => {
        const genres = response.data;
        this.setState({
          options: genres && genres.splice(0, 50)
        });
      })
      .catch(error => {
        console.log(error)
      })
  }
  
  componentWillUnmount() {
    this.state.source.cancel();
  }
  
  render() {
    const options = this.state.options;

    return (
      <Grid item xs={12}>
        <Typography variant="body1" align="left" gutterBottom>Genres</Typography>
        <Select isMulti
                placeholder="Select genres..."
                name="genres"
                onChange={this.props.onChange}
                value={this.props.value}
                options={options} />
        <br/>
      </Grid>
    );
  }
}

export default GenrePicker;