import * as Icons from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default ({
  color = "var(--color-black-leather-jacket)",
  icon,
  isSmall = false,
  ...props
}) => {
  // eslint-disable-next-line import/namespace
  library.add(Icons[`fa${icon[0].toUpperCase()}${icon.substr(1)}`]);

  return (
    <FontAwesomeIcon
      icon={icon}
      color={color}
      size={isSmall ? "sm" : "1x"}
      {...props}
    />
  );
};
