import styled from "@emotion/styled";
import PropTypes from "prop-types";
import React from "react";
import ReactSelect from "react-select";

const StyledReactSelect = styled(ReactSelect)`
  font-size: 0.875rem;
  margin-left: ${p => (p.withMarginLeft ? "1rem" : 0)};
  margin-right: ${p => (p.withMarginRight ? "1rem" : 0)};
  width: 15rem;

  .class__control {
    border-color: var(--color-border);
    border-radius: 0;
    min-height: 0;
  }

  .class__value-container {
    max-height: 6rem;
    padding: 0.3rem 0.4rem;
    overflow-y: auto;
  }

  .class__dropown-indicator {
    padding: 0.325rem;
  }

  .class__indicator-separator {
    margin: 0.325rem 0;
  }

  .class__input {
    padding: 0;
  }

  .class__placeholder {
    color: var(--color-placeholder);
  }

  .class__multi-value {
    border-radius: 0;
  }

  .class__menu {
    border: solid 1px var(--color-border);
    border-radius: 0;
    border-top: 0;
    box-shadow: none;
    margin: 0;
  }

  .class__menu-list {
    padding: 0;
  }
`;

/**
 * Be careful! The {instanceId} prop is mandatory to avoid "Prop `id` did not match." warning.
 *
 * @see https://github.com/trezor/trezor-suite/issues/290#issuecomment-516349580
 */
const Select = React.forwardRef(
  ({ withMarginLeft = false, withMarginRight = false, ...props }, ref) => (
    <StyledReactSelect
      classNamePrefix="class"
      ref={ref}
      withMarginLeft={withMarginLeft}
      withMarginRight={withMarginRight}
      {...props}
    />
  ),
);

Select.propTypes = {
  clearValue: PropTypes.func,
  emotion: PropTypes.any,
  getStyles: PropTypes.func,
  getValue: PropTypes.func,
  hasValue: PropTypes.bool,
  instanceId: PropTypes.string.isRequired,
  isMulti: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  selectOption: PropTypes.func,
  selectProps: PropTypes.any,
  setValue: PropTypes.func,
  withMarginLeft: PropTypes.bool,
  withMarginRight: PropTypes.bool,
};

Select.displayName = "Select";

export default Select;
