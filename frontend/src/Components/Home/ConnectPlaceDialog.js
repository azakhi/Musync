import React, {Component} from "react";

import DialogContent from "@material-ui/core/DialogContent/index";
import DialogContentText from "@material-ui/core/DialogContentText/index";
import TextField from "@material-ui/core/TextField/index";
import DialogActions from "@material-ui/core/DialogActions/index";
import Button from "@material-ui/core/Button/index";
import Dialog from "@material-ui/core/Dialog/index";
import auth from "../../auth/auth";


class ConnectPlaceDialog extends Component {
  constructor(props){
    super(props);
    
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.state = {
      value: ""
    };
  }
  
  onChange(event) {
    this.setState({
      value: event.target.value
    })
  }
  
  handleSubmit() {
    const id = this.props.placeId;
    const pin = this.state.value;

    auth.connectToPlace(id, pin)
      .then(() => {
        this.props.history.push("/place/" + id);
      })
      .catch((error)=>{
        console.log(error)
      })
  }
  
  render() {
    return (
      <Dialog open={this.props.open}
              onClose={this.props.handleClose}>
      
        <DialogContent>
          <DialogContentText>
            Enter the PIN Code of {this.props.name}
          </DialogContentText>
        
          <TextField autoFocus
                     margin="dense"
                     value={this.state.value}
                     onChange={this.onChange}
                     type="number"
                     fullWidth />
        </DialogContent>
      
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
        
          <Button onClick={this.handleSubmit} color="primary" variant="contained">
            Join Place
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConnectPlaceDialog;