import React from "react";
import List from "@material-ui/core/List/index";
import ListItem from "@material-ui/core/ListItem/index";
import ListItemText from "@material-ui/core/ListItemText/index";
import Typography from "@material-ui/core/Typography/index";
import PlaceCard, {PlaceCardTypes} from "../Place/PlaceCard";

const PlaceMapCard = (props) => {

	const { place } = props

	return (
			<PlaceCard place={place}
	               type={PlaceCardTypes.AllPlaces}
	               handleConnectPlace={0} />
	);
}

export default PlaceMapCard
