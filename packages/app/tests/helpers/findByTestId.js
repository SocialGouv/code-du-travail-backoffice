// @ts-check

/**
 * @param {import("react-test-renderer").ReactTestRendererJSON} reactTestRendererJson
 *
 * @returns {?import("react-test-renderer").ReactTestRendererJSON}
 */
export default function findByTestId(reactTestRendererJson, testId) {
  if (reactTestRendererJson.children === null) {
    return null;
  }

  const jsonChildren =
    /** @type {import("react-test-renderer").ReactTestRendererJSON[]} */
    (reactTestRendererJson.children.filter(child => typeof child !== "string"));

  const iMax = jsonChildren.length;
  if (iMax === 0) {
    return null;
  }

  let i = -1;
  while (++i < iMax) {
    const jsonChild = jsonChildren[i];

    if (jsonChild.props["data-testid"] === testId) {
      return jsonChild;
    }

    const maybeJsonGrandChild = findByTestId(jsonChild, testId);
    if (maybeJsonGrandChild !== null) {
      return maybeJsonGrandChild;
    }
  }

  return null;
}
