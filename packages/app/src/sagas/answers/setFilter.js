import setFilters from "./setFilters";

export default function* setFilter({ meta: { key, value } }) {
  return yield setFilters({
    meta: {
      filters: {
        [key]: value
      }
    }
  });
}
