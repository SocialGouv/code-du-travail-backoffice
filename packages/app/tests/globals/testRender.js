// @ts-check

import R from "ramda";
import TestRenderer from "react-test-renderer";

function findByType(type) {
  return R.find(R.propEq("type", type), this.children);
}

function augmentNode(node) {
  if (typeof node === "string" || node.children === null) {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(augmentNode);
  }

  if (node.children.length !== 0) {
    const maybeStringChild = node.children.find(child => typeof child === "string");

    node.text = maybeStringChild !== undefined ? maybeStringChild : null;
  } else {
    node.text = null;
  }

  node.innerText =
    node.children.length !== 0 && node.children.filter(child => typeof child !== "string");

  node.findByType = findByType.bind(node);
  node.children = node.children.map(augmentNode);

  return node;
}

function testRender(component) {
  const rootNode = TestRenderer.create(component).toJSON();

  return augmentNode(rootNode);
}

// @ts-ignore
global.testRender = testRender;
