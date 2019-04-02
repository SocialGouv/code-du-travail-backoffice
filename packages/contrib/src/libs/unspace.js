/**
 * Remove trimming spaces and merge multiple ones from a string.
 */
export default function(text) {
  return text.trim().replace(/\s+/g, " ");
}
