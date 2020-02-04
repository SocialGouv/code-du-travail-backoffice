import R from "ramda";
import TestRenderer from "react-test-renderer";

function findByType(type) {
  return R.find(R.propEq("type", type), this.children);
}

function augmentNode(node) {
  if (typeof node !== "object" || node.children === null) {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(augmentNode);
  }

  node.findByType = findByType.bind(node);
  node.children = node.children.map(augmentNode);

  return node;
}

global.testRender = component => {
  const rootNode = TestRenderer.create(component).toJSON();

  return augmentNode(rootNode);
};
