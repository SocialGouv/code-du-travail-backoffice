import * as Icons from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

const Icon = styled(FontAwesomeIcon)`
  width: ${({ size }) => (size === "sm" ? "0.5rem" : "1rem")} !important;
`;

export default ({
  color = "var(--color-black-leather-jacket)",
  icon,
  isSmall = false,
  ...props
}) => {
  // eslint-disable-next-line import/namespace
  library.add(Icons[`fa${icon[0].toUpperCase()}${icon.substr(1)}`]);

  return (
    <Icon icon={icon} color={color} size={isSmall ? "sm" : "1x"} {...props} />
  );
};
