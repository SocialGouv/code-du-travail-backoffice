export const validateMandatoryNullableOneOf = values => (props, propName, componentName) => {
  const allowedValues = [...values, null];

  const propValue = props[propName];
  if (allowedValues.includes(propValue)) return;

  return propValue === undefined
    ? new Error(
        `The prop \`${propName}\` is marked as required in \`${componentName}\`, but its value is \`undefined\`.`,
      )
    : new Error(
        `Invalid prop \`${propName}\` of value \`${propValue}\` supplied to \`${componentName}\`, expected one of ["${values.join(
          '", "',
        )}", null].`,
      );
};

export const validateMandatoryNullableString = (props, propName, componentName) => {
  const propValue = props[propName];
  if (typeof propValue === "string" || propValue === null) return;

  return propValue === undefined
    ? new Error(
        `The prop \`${propName}\` is marked as required in \`${componentName}\`, but its value is \`undefined\`.`,
      )
    : new Error(
        `Invalid prop \`${propName}\` of type \`${typeof propValue}\` supplied to \`${componentName}\`, expected \`string\` or \`null\`.`,
      );
};
