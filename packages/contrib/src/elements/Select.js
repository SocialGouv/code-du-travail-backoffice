import React from "react";
import ReactSelect from "react-select";

const styles = {
  container: s => ({
    ...s,
    fontSize: "0.875rem",
    width: "15rem"
  }),
  control: s => ({
    ...s,
    borderRadius: 0,
    minHeight: 0
  }),
  dropdownIndicator: s => ({
    ...s,
    padding: "0.325rem"
  }),
  indicatorSeparator: s => ({
    ...s,
    margin: "0.325rem 0"
  }),
  input: s => ({
    ...s,
    padding: 0
  }),
  menu: s => ({
    ...s,
    border: "solid 1px var(--color-border)",
    borderTop: 0,
    borderRadius: 0,
    boxShadow: "none",
    margin: 0
  }),
  menuList: s => ({
    ...s,
    padding: 0
  })
};

const Select = (props, ref) => <ReactSelect ref={ref} styles={styles} {...props} />;

export default React.forwardRef(Select);
