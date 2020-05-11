import styled from "@emotion/styled";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";

const StyledIcon = styled(FontAwesomeIcon)`
  cursor: ${({ role }) => (role === "button" ? "pointer" : "default")};
  margin-left: ${p => (p.withMarginLeft ? "0.5rem" : 0)};
  margin-right: ${p => (p.withMarginRight ? "0.5rem" : 0)};
`;

const convertFaSlugToFaProp = slug =>
  "fa" + slug.replace(/^([a-z])|-([a-z])/g, g => g[Number(g.length !== 1)].toUpperCase());

const Icon = ({
  color = "var(--color-black-leather-jacket)",
  icon,
  isSmall = false,
  role = "img",
  withMarginLeft = false,
  withMarginRight = false,
  ...props
}) => {
  // eslint-disable-next-line import/namespace
  library.add(Icons[convertFaSlugToFaProp(icon)]);

  return (
    <StyledIcon
      color={color}
      icon={icon}
      role={role}
      size={isSmall ? "sm" : "1x"}
      withMarginLeft={withMarginLeft}
      withMarginRight={withMarginRight}
      {...props}
    />
  );
};

Icon.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  isSmall: PropTypes.bool,
  role: PropTypes.string,
  withMarginLeft: PropTypes.bool,
  withMarginRight: PropTypes.bool,
};

export default Icon;
