import React from "react";
import { Marker, InfoWindow } from "react-google-maps";
import PlaceMapCard from "./PlaceMapCard"

export default class PlaceMarker extends React.Component {

  state = {
    isOpen: false,
    activeMarker: this.props.activeMarker
  }

  closeOtherMarkers = (uid) => {
		this.setState({activeMarker: uid})
	}

  toggleOpen = () => {
    this.setState({isOpen: !this.state.isOpen}, () =>{
      if (!this.state.isOpen){
        this.setState({activeMarker: false}, () => {
          this.setState({activeMarker: null});
        })
      } else{
        this.setState({activeMarker: this.props.uid});
      }
    }
  )
  }

  componentWillReceiveProps(nextProps){
    this.setState({activeMarker: nextProps.activeMarker})
  }

  render(){
    return(
      <div>
        <Marker onClick={this.toggleOpen}
          position={this.props.location}
        >
        { this.state.isOpen && this.state.activeMarker ?
          <InfoWindow maxWidth={800} defaultPosition={ this.props.location } >
            <PlaceMapCard place={this.props.place}/>
          </InfoWindow> : null
        }
        </Marker>
      </div>
    )
  }
}
