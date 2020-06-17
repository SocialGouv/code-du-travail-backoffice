// @ts-check

import api from "../../libs/api";
import dilaApi from "../../libs/dilaApi";

/**
 * @param {string} input
 *
 * @returns {string}
 */
function cleanHtml(input) {
  const formatted = input
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<\/p>/g, "\n\n")
    .replace(/<p>/g, "")
    .trim();

  const $div = document.createElement("div");
  $div.innerHTML = formatted;

  return $div.innerText;
}

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
 * @param {?string} dila_id
 *
 * @returns {Promise<[string, ?string]>}
 */
export default async function getLabelAndContent(value, dila_id) {
  if (dila_id === null) {
    return [value, null];
  }

  if (dila_id.startsWith("KALIARTI")) {
    const { data, sections } = await dilaApi.get(`/article/${dila_id}`);

    const { content: rawContent, index } = data;
    const title = sections.map(({ data: { title } }) => title).join(" » ");
    const labelChunks = [];
    if (value.trim().length === 0) {
      labelChunks.push(`[${index}]`);
      labelChunks.push(title);
    } else {
      labelChunks.push(value);
    }

    const label = labelChunks.join(" ");
    const content = `${getContentTitle(title, index)}${cleanHtml(rawContent)}`;

    return [label, content];
  }

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
