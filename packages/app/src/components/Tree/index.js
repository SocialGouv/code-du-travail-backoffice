import PropTypes from "prop-types";
import React from "react";
import unistUtilFind from "unist-util-find";

import Icon from "../../elements/Icon";
import TreeProps from "../../props/Tree";
import { validateMandatoryNullableString } from "../../props/validators";
import { Container, Item, List } from "./index.style";

const getKeyPath = (node, path = []) => {
  if (node.parent === null) {
    return path;
  }

  const {
    data: { key },
  } = node;
  const newPath = [key, ...path];

  return getKeyPath(node.parent, newPath);
};

function findKeyPathFromKey(tree, key) {
  const foundNode = unistUtilFind(tree, { data: { key } });

  return getKeyPath(foundNode);
}

class Tree extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedKey: null,
      selectedKeyPath: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedKey === null || nextProps.selectedKey === prevState.selectedKey) {
      return null;
    }

    const { data, selectedKey } = nextProps;

    const selectedKeyPath = findKeyPathFromKey(data, selectedKey);

    return {
      selectedKey,
      selectedKeyPath,
    };
  }

  selectChild(data) {
    const { onChange } = this.props;

    onChange(data);
  }

  toggleList(key, depth) {
    const { selectedKeyPath } = this.state;

    if (selectedKeyPath.includes(key)) {
      this.setState({
        selectedKeyPath: selectedKeyPath.slice(0, depth),
      });

      return;
    }

    if (depth < selectedKeyPath.length) {
      this.setState({
        selectedKeyPath: [...selectedKeyPath.slice(0, depth), key],
      });

      return;
    }

    this.setState({
      selectedKeyPath: [...selectedKeyPath, key],
    });
  }

  renderChild(child, depth) {
    const { children, data } = child;
    const { key, label } = data;
    const { selectedKey } = this.props;
    const { selectedKeyPath } = this.state;

    if (children === undefined || children.length === 0) {
      return (
        <Item depth={depth} key={key} onClick={() => this.selectChild(data)}>
          <Icon icon="file" />
          {selectedKey === key && <b>{label}</b>}
          {selectedKey !== key && label}
        </Item>
      );
    }

    if (selectedKeyPath.includes(key)) {
      return (
        <div key={key}>
          <Item depth={depth} onClick={() => this.toggleList(key, depth)}>
            <Icon icon="caret-down" />
            {label}
          </Item>
          <List>{this.renderChildren(children, depth + 1)}</List>
        </div>
      );
    }

    return (
      <Item depth={depth} key={key} onClick={() => this.toggleList(key, depth)}>
        <Icon icon="caret-right" />
        {label}
      </Item>
    );
  }

  renderChildren(children, depth = 0) {
    return children.map(child => this.renderChild(child, depth));
  }

  render() {
    const { data: tree } = this.props;

    const branches = tree.children;

    return <Container>{this.renderChildren(branches)}</Container>;
  }
}

Tree.propTypes = {
  data: PropTypes.exact(TreeProps).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedKey: validateMandatoryNullableString,
};

export default Tree;
