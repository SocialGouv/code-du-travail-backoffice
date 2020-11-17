// @ts-check

/**
 * Execute the function property of a "react-test-renderer" component.
 *
 * @param {import("react-test-renderer").ReactTestRenderer} reactTestRenderer
 * @param {string} propertyName
 * @param {string} testId
 * @param {?[]} params
 *
 * @returns {void}
 */
export default function runTestRenderedProperty(reactTestRenderer, propertyName, testId, params) {
  if (testId !== undefined && typeof testId !== "string") {
    throw new Error(`Error: <testid> must be a string.`);
  }

  const reactTestInstance =
    testId !== undefined
      ? reactTestRenderer.root.findByProps({ "data-testid": testId })
      : reactTestRenderer.root;

  if (reactTestInstance === undefined) {
    throw new Error(`Error: {data-testid}="${testId}" not found.`);
  }

  if (typeof reactTestInstance === "string") {
    throw new Error(`Error: {data-testid}="${testId}" is a string.`);
  }

  const property = reactTestInstance.props[propertyName];

  if (property === undefined) {
    throw new Error(`Error: {${propertyName}} does not exist.`);
  }

  if (typeof property !== "function") {
    throw new Error(`Error: {${propertyName}} is not a function.`);
  }

  property.apply(null, params);
}
