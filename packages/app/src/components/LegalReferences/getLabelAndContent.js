// @ts-check

import api from "../../libs/api";

/**
 * @param {?string} title
 * @param {?string} index
 *
 * @returns {string}
 */
function getContentTitle(title, index) {
  if (title !== null) {
    if (index !== null) {
      return `${title} » Article ${index}\n\n`;
    }

    return `${title}\n\n`;
  }

  if (index !== null) {
    return `Article ${index}\n\n`;
  }

  return "";
}

/**
 * Generate a legal reference tag label and content.
 *
 * @param {string} value
 * @param {string | null} dila_id
 *
 * @returns {Promise<[string, string | null]>}
 */
export default async function getLabelAndContent(value, dila_id) {
  if (dila_id === null) return [value, null];

  const { content: rawContent, index, title } = await api.get(`/legal-references/${dila_id}`);

  const labelChunks = [];

  if (value.trim().length === 0) {
    labelChunks.push(`[${index}]`);
    labelChunks.push(title);
  } else {
    labelChunks.push(value);
  }

  const label = labelChunks.join(" ");

  const content = `${getContentTitle(title, index)}${rawContent}`;

  return [label, content];
}
