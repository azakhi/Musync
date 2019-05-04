import React from "react";
import Select from 'react-select'
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";


const GenrePicker = (props) =>  {
  
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
  
  return (
    <Grid item xs={12}>
      <Typography variant="body1" align="left" gutterBottom>Genres</Typography>
      <Select isMulti
              placeholder="Select genres..."
              name="genres"
              onChange={props.onChange}
              options={options} />
      <br/>
    </Grid>
  );
};

export default GenrePicker;