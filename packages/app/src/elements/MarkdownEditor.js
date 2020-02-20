import styled from "@emotion/styled";
import Medixtor from "react-medixtor";

const MarkdownEditor = styled(Medixtor)`
  border: solid 1px var(--color-border) !important;
  flex-grow: unset;
  min-height: 20rem;

  .editor {
    color: var(--color-black-leather-jacket);
  }
  .editor-menu-container button {
    display: inline-flex;
  }
  .editor-status {
    min-height: 1.5rem;
  }

  .preview {
    background-color: white;
    line-height: 1.4;
    padding-top: 0 !important;

    a {
      color: #0053b3;

      :after {
        content: "";
        position: relative;
        top: 1px;
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-left: 5px;
        background: url("/static/assets/icons/external-link.svg") 100% 50% / 15px no-repeat;
      }

      :hover {
        text-decoration: none;
      }
    }

    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #006ab2;
    }
    h2 {
      font-size: 1.875rem;
    }
    h3 {
      font-size: 1.625rem;
    }
    h4 {
      font-size: 1.375rem;
    }
    h5 {
      font-size: 1.125rem;
    }
    h6 {
      font-size: 1rem;
    }

    p {
      color: #434956;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
    }

    ul {
      list-style-type: disc;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      padding-inline-start: 20px;

      li {
        display: list-item;
      }

      ul {
        list-style-type: circle;
      }
    }
  }
`;

export default MarkdownEditor;
