import { compose, curry, reduce, toPairs } from "ramda";

const removeFirstChar = curry(str => str.substr(1, Infinity));

/**
 * Make an API filter URL string from an URL path and a data object.
 */
export default function makeApiFilter(uri, data) {
  const queryString = compose(
    removeFirstChar,
    reduce((acc, [key, value]) => `${acc}&${key}=eq.${value}`, ""),
    toPairs,
  )(data);

  return `${uri}?${queryString}`;
}
