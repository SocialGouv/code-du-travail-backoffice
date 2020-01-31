import ReactTable from "react-table";
import styled from "@emotion/styled";

export default styled(ReactTable)`
  .rt-thead {
    background-color: rgba(0, 0, 0, 0.02);
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);

    &.-header {
      box-shadow: none;
    }
  }

  .rt-tr > .rt-th,
  .rt-tr > .rt-td {
    > div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .rt-tr > .rt-th {
    font-weight: 600;
    text-align: left;
    transition: none;

    &.-sort-asc,
    &.-sort-desc {
      box-shadow: none;
    }
    &.-sort-asc {
      border-bottom: solid 3px rgba(0, 0, 0, 0.6);
      padding: 5px 5px 2px;
    }
    &.-sort-desc {
      border-top: solid 3px rgba(0, 0, 0, 0.6);
      padding: 2px 5px 5px;
    }

    &.-cursor-pointer:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;
