import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Header from "../utils/Header";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


class CreatePlace extends Component {
  constructor(props) {
    super(props);
    
    this.state = {};
  }
  
  render() {
    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>
        
        <Header/>
  
        <Grid item xs={12} style={{textAlign: "center"}}>
          <Typography variant="h5"
                      color="textPrimary">
            Create a new Place
          </Typography>
  
          <form>
            <TextField required
                       id="name"
                       label="Name"
                       onChange={e => this.handleNameChange(e)}
                       margin="dense"/>
            <br/>
            <TextField required
                       id="name"
                       label="Name"
                       onChange={e => this.handleNameChange(e)}
                       margin="dense"/>
                       
            <br/>
            <Button variant="text"
                    color="primary"
                    type="submit">
              Create
            </Button>
          </form>
          
        </Grid>
      </Grid>
    );
  }
}

export default CreatePlace;