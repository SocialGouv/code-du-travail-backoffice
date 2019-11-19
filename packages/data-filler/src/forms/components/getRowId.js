import { getRouteBySource } from "../../sources";

const getRowId = row =>
  row.source && row.slug
    ? `/${getRouteBySource(row.source) || row.source}/${row.slug}`
    : row.url;

export default getRowId;
