import React from "react";
import { RadioSVGMap } from "react-svg-map";

import regions from "./regions.json";

import "react-svg-map/lib/index.css";

export default function({ onChange }) {
  return <RadioSVGMap map={regions} onChange={node => onChange(node.id)} />;
}
