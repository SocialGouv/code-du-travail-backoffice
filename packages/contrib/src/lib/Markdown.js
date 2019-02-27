import showdown from "showdown";
import sanitizeHtml from "sanitize-html";

// https://github.com/showdownjs/showdown#valid-options
const converter = new showdown.Converter({
  noHeaderId: true,
  simplifiedAutoLink: true,
  underline: true
});

// https://github.com/punkave/sanitize-html#node-recommended
const ALLOWED_ATTRS = {
  a: ["href"]
};
const ALLOWED_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "em",
  "h2",
  "h3",
  "i",
  "p",
  "strong",
  "u"
];

/**
 * Convert HTML from/to Markdown and sanitize both input and output HTML.
 */
export default class Markdown {
  fromHtml(htmlSource) {
    const cleanHtmlSource = this._cleanHtmlSource(htmlSource);

    return this._makeMarkdown(cleanHtmlSource);
  }

  toHtml(markdownSource) {
    const htmlSource = converter.makeHtml(markdownSource);

    return this._cleanHtmlSource(htmlSource);
  }

  _cleanHtmlSource(htmlSource) {
    return sanitizeHtml(htmlSource, {
      allowedAttributes: ALLOWED_ATTRS,
      allowedTags: ALLOWED_TAGS
    });
  }

  _makeMarkdown(htmlSource) {
    const markdownSource = converter.makeMarkdown(htmlSource);

    // This fixes strange behaviors from showdown library.
    // Handling underlines is still experimental:
    // https://github.com/showdownjs/showdown#valid-options
    return markdownSource
      .replace(/<\/u>\n\n/g, "</u>")
      .replace(/\n>\s*\n/g, "\n")
      .replace(/^>\s+/gm, "> ")
      .trim();
  }
}
