import "react-svg-map/lib/index.css";

import React from "react";
import { RadioSVGMap } from "react-svg-map";

import regions from "./regions.json";

const FranceMap = ({ onChange }) => {
  return <RadioSVGMap map={regions} onChange={node => onChange(node.id)} />;
};

export default FranceMap;
