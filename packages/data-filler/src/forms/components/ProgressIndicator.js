import React from "react";
import Gradient from "gradient2";

const gradientColors = ["#cb3837", "#1CBF43"];
const progressGradients = new Gradient({
  colors: gradientColors,
  steps: 100,
  model: "rgb"
}).toArray();

const ProgressIndicator = ({ score }) => {
  const scaledScore = parseInt(score && Math.min(100 - 1, score)) || 0;
  const color = progressGradients[scaledScore] || {
    rgb: () => gradientColors[0]
  };
  return (
    <div
      style={{
        display: "inline-block",
        margin: "0 10px 0 5px",
        verticalAlign: "middle",
        background: color && color.rgb(),
        width: 10,
        height: 10
      }}
    >
      &nbsp;
    </div>
  );
};

export default ProgressIndicator;
