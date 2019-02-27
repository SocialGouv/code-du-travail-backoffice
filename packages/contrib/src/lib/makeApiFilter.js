import { compose, reduce, toPairs } from "ramda";

/**
 * Make an API filter URL string from an URL path and a data object.
 */
export default function makeApiFilter(uri, data) {
  const queryString = compose(
    reduce((acc, [key, value]) => `${acc}&${key}=eq.${value}`, ""),
    toPairs
  )(data);

  return `${uri}?${queryString}`;
}
