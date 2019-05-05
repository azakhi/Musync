import React from "react";
import PlaceCard, {PlaceCardTypes} from "../Place/PlaceCard";

const PlaceMapCard = (props) => {

	const { place } = props;

	return (
			<PlaceCard place={place}
	               type={PlaceCardTypes.AllPlaces}
	               handleConnectPlace={0} />
	);
};

export default PlaceMapCard
