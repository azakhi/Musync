import React from "react";

import Grid from "@material-ui/core/Grid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from "@material-ui/core/Link";


export default function footer() {
  const brands = [
    {name: "facebook", url: "#"},
    {name: "twitter", url: "#"},
    {name: "instagram", url: "#"},
    {name: "linkedin", url: "#"}];
  
  const brandLinks = brands.map(brand => {
    return generateBrandLink(brand.name, brand.url);
  });
  
  return (
    <Grid item xs={12}>
      {brandLinks}
    </Grid>
  );
}

function generateBrandLink(brand, url) {
  return (
    <Link href={url} style={{margin: "10px"}}>
      <FontAwesomeIcon icon={["fab", brand]} size="lg"/>
    </Link>
  );
}