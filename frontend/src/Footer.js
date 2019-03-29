import React from "react";

import Grid from "@material-ui/core/Grid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from "@material-ui/core/Link";


export default function footer() {
  const brands = [
    {name: "facebook", url: "#facebook"},
    {name: "twitter", url: "#twitter"},
    {name: "instagram", url: "#instagram"},
    {name: "linkedin", url: "#linkedin"}];
  
  let id = 0;
  const brandLinks = brands.map(brand => {
    id++;
    return generateBrandLink(brand.name, brand.url, id);
  });
  
  return (
    <Grid item xs={12}>
      {brandLinks}
    </Grid>
  );
}

function generateBrandLink(brand, url, id) {
  return (
    <Link href={url} style={{margin: "10px"}} key={id}>
      <FontAwesomeIcon icon={["fab", brand]} size="lg"/>
    </Link>
  );
}