import css from "styled-jsx/css";

export default css`
  .Container {
    display: flex;
    padding-top: 0.3rem;
  }

  .Dropdown {
    color: var(--color-dark-slate-gray);
    cursor: pointer;
    font-size: 0.875rem;
    margin-left: 2.5rem;
    padding: 3px 0 0.5rem;
    position: relative;
    white-space: nowrap;
  }
  .Dropdown:hover > .DropdownMenu {
    display: flex;
  }

  .DropdownText {
    margin: 0.5rem 0.25rem 0.5rem 0;
  }

  .DropdownMenu {
    background-color: white;
    box-shadow: 0 0 0.125rem lightgray;
    display: none;
    flex-direction: column;
    left: auto;
    margin-top: 0.5rem;
    position: absolute;
    right: 0;
    z-index: 1;
  }

  .DropdownLink {
    cursor: pointer;
    padding: 0.375rem 0.75rem;
    white-space: nowrap;
  }
  .DropdownLink:hover {
    background-color: var(--color-background);
    border-bottom: 0;
  }
  .DropdownLink > svg {
    margin-right: 0.5rem;
  }
`;
