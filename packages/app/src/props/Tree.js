import PropTypes from "prop-types";

const BranchDataShape = {
  cid: PropTypes.string,
  id: PropTypes.string,
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
};

const BranchShape = {
  data: PropTypes.exact(BranchDataShape).isRequired,
  type: PropTypes.oneOf(["agreement", "answer", "article", "version"]).isRequired,
};

const Branch = PropTypes.exact(BranchShape);
BranchShape.children = PropTypes.arrayOf(Branch);

const Tree = {
  children: PropTypes.arrayOf(Branch).isRequired,
  type: PropTypes.oneOf(["root"]).isRequired,
};

export default Tree;
