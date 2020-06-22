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
 * Generate a content, a label and an ID from the last udpated DILA data.
 *
 * @param {{ dila_cid: ?string, dila_id: ?string, value: string }} dila_id
 *
 * @returns {Promise<{content: ?string, id: ?string, label: string}>}
 */
export default async function getUpdatedData({ dila_cid, dila_id, value }) {
  const fullData = {
    content: null,
    id: null,
    label: value,
  };

  if (dila_cid === null) {
    return fullData;
  }

  if (dila_cid.startsWith("KALIARTI")) {
    const { data, sections } = await dilaApi.get(`/article/${dila_cid}`);

    const { id, content: rawContent, index } = data;
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

    return {
      content,
      id,
      label,
    };
  }

  const { id, content: rawContent, index, title } = await api.get(`/legal-references/${dila_id}`);

  const labelChunks = [];
  if (value.trim().length === 0) {
    labelChunks.push(`[${index}]`);
    labelChunks.push(title);
  } else {
    labelChunks.push(value);
  }

  const label = labelChunks.join(" ");
  const content = `${getContentTitle(title, index)}${rawContent}`;

  return {
    content,
    id,
    label,
  };
}
