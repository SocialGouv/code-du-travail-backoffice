/**
 * Check if a <text> string contains the <searchString> value including the
 * French commonly accented and special characters.
 */
export default function(searchString, text) {
  const searchPattern = searchString
    .replace(/([.*+?^${}()|[\]\\])/gi, "\\$&")
    .replace(/a/gi, "[aáâàä]")
    .replace(/e/gi, "[eéêèë]")
    .replace(/i/gi, "[iíîìï]")
    .replace(/o/gi, "[oóôòö]")
    .replace(/u/gi, "[uúûùü]")
    .replace(/c/gi, "[cç]")
    .replace(/'|’/g, "['’]");

  return new RegExp(searchPattern, "i").test(text);
}
