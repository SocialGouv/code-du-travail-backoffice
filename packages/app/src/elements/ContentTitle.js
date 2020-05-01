import styled from "@emotion/styled";
import PropTypes from "prop-types";
import React from "react";

const StyledContentTitle = styled.h3`
  color: black;
  font-size: 1.1rem;
  font-weight: 600;
  margin: ${props => (props.isFirst ? "0 0 0.5rem" : "1.5rem 0 0.5rem")};
  user-select: none;
`;

const ContentTitle = ({ isFirst = false, ...props }) => (
  <StyledContentTitle isFirst={isFirst} {...props} />
);

ContentTitle.propTypes = {
  isFirst: PropTypes.bool,
};

export default ContentTitle;
