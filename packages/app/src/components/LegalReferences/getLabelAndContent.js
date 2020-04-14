import customAxios from "../../libs/customAxios";

/**
 * Generate a legal reference tag label and content.
 *
 * @param {string} value
 * @param {string | null} dila_id
 */
export default async function getLabelAndContent(value, dila_id) {
  if (dila_id === null) return [value, null];

  const {
    data: { content: rawContent, index, title },
  } = await customAxios().get(`/legal-references/${dila_id}`);

  const labelChunks = [];

  if (value.trim().length === 0 || /^(KALI|LEGI)/.test(value)) {
    labelChunks.push(`[${index}]`);
    labelChunks.push(title);
  } else {
    labelChunks.push(value);
  }

  const label = labelChunks.join(" ");

  const content = `${title !== null ? `${title} ` : ""}${
    index !== null ? `» Article ${index}` : ""
  }\n\n${rawContent}`;

  return [label, content];
}
