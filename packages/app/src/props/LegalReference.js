import PropTypes from "prop-types";

const CATEGORIES = ["agreement", "labor_code", null];

export const validateCategory = (props, propName, componentName) => {
  const propValue = props[propName];
  if (CATEGORIES.includes(propValue)) return;

  return propValue === undefined
    ? new Error(
        `The prop \`category\` is marked as required in \`${componentName}\`, but its value is \`undefined\`.`,
      )
    : new Error(
        `Invalid prop \`category\` of value \`${propValue}\` supplied to \`${componentName}\`, expected one of ["agreement", "labor_code", null].`,
      );
};

export default {
  answer_id: PropTypes.string.isRequired,
  category: validateCategory,
  dila_id: PropTypes.string,
  id: PropTypes.string.isRequired,
  url: PropTypes.string,
  value: PropTypes.string.isRequired,
};
