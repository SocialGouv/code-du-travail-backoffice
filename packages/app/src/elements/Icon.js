import styled from "@emotion/styled";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Container = styled(FontAwesomeIcon)`
  cursor: ${({ role }) => (role === "button" ? "pointer" : "default")};
  width: ${({ size }) => (size === "sm" ? "0.5rem" : "1rem")} !important;
`;

const convertFaSlugToFaProp = slug =>
  "fa" + slug.replace(/^([a-z])|-([a-z])/g, g => g[Number(g.length !== 1)].toUpperCase());

const Icon = ({ color = "var(--color-black-leather-jacket)", icon, isSmall = false, ...props }) => {
  // eslint-disable-next-line import/namespace
  library.add(Icons[convertFaSlugToFaProp(icon)]);

  return <Container color={color} icon={icon} size={isSmall ? "sm" : "1x"} {...props} />;
};

export default Icon;
