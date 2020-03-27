import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import unified from "unified";

/**
 * Convert HTML from/to Markdown and sanitize both input and output HTML.
 *
 * TODO Use "remark-lint" to lint Markdown instead of custom replacements.
 * https://github.com/remarkjs/remark-lint
 */
class Markdown {
  fromHtml(htmlSource) {
    const markdownSource = unified()
      .use(rehypeSanitize)
      .use(rehypeParse)
      .use(rehypeRemark)
      .use(remarkStringify, {
        gfm: true,
        listItemIndent: "1",
        rule: "-",
        ruleSpaces: false,
      })
      .processSync(htmlSource)
      .contents.trim()
      .replace(/ {2}$/gm, "<br>")
      .replace(/^( *-.*)\n{2,}( *-)/gm, "$1\n$2")
      .replace(/^( *-.*)\n{2,}( *-)/gm, "$1\n$2")
      .replace(/^( *\d+\..*)\n{2,}( *\d+\.)/gm, "$1\n$2")
      .replace(/^( *\d+\..*)\n{2,}( *\d+\.)/gm, "$1\n$2");

    return markdownSource;
  }

  toHtml(markdownSource) {
    const htmlSource = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .use(rehypeSanitize)
      .processSync(markdownSource.replace(/<br>/g, " ".repeat(2))).contents;

    return htmlSource;
  }
}

export default new Markdown();
