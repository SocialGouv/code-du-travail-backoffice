import * as Icons from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "@emotion/styled";

const Icon = styled(FontAwesomeIcon)`
  cursor: ${({ role }) => (role === "button" ? "pointer" : "default")};
  width: ${({ size }) => (size === "sm" ? "0.5rem" : "1rem")} !important;
`;

const convertFaSlugToFaProp = slug =>
  "fa" + slug.replace(/^([a-z])|-([a-z])/g, g => g[Number(g.length !== 1)].toUpperCase());

export default ({
  color = "var(--color-black-leather-jacket)",
  icon,
  isSmall = false,
  ...props
}) => {
  // eslint-disable-next-line import/namespace
  library.add(Icons[convertFaSlugToFaProp(icon)]);

  return <Icon color={color} icon={icon} size={isSmall ? "sm" : "1x"} {...props} />;
};
