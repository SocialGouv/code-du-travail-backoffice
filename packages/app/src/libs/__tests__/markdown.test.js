import prettier from "prettier";

import markdown from "../markdown";

describe("libs/Markdown", () => {
  it("should return an instance of Markdown", () => {
    expect(markdown.constructor.name).toBe("Markdown");
  });

  const htmlSource =
    `
<h2>Ceci est un titre</h2>
<h3>Ceci est un sous-titre</h3>
<p>
  Ceci est un paragraphe<br />
  sur plusieurs<br />
  lignes
</p>
<hr />
<blockquote>
  <p>Ceci est une citation.</p>
</blockquote>
<p>Ceci est <em>un texte en italique</em>.</p>
<p>Ceci est <strong>un texte en gras</strong>.</p>
<p>Ceci est <a href="https://www.example.com">un lien</a>.</p>
<ul>
  <li>
    Ceci
    <ul>
      <li>est</li>
    </ul>
  </li>
  <li>
    une
    <ul>
      <li>
        liste
        <ul>
          <li>ordonnée.</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
<ol>
  <li>
    Ceci
    <ol>
      <li>est</li>
    </ol>
  </li>
  <li>
    une
    <ol>
      <li>
        liste
        <ol>
          <li>numérotée.</li>
        </ol>
      </li>
    </ol>
  </li>
</ol>
  `.trim() + "\n";

  const markdownSource = `
## Ceci est un titre

### Ceci est un sous-titre

Ceci est un paragraphe<br>
sur plusieurs<br>
lignes

---

> Ceci est une citation.

Ceci est _un texte en italique_.

Ceci est **un texte en gras**.

Ceci est [un lien](https://www.example.com).

- Ceci
  - est
- une
  - liste
    - ordonnée.

1. Ceci
   1. est
2. une
   1. liste
      1. numérotée.
    `.trim();

  describe("#fromHtml()", () => {
    it("should return the expected Markdown string", () => {
      // console.debug(markdown.fromHtml(htmlSource));

      expect(markdown.fromHtml(htmlSource)).toBe(markdownSource);
    });
  });

  describe("#toHtml()", () => {
    it("should return the expected Markdown string", () => {
      const result = markdown.toHtml(markdownSource);
      const prettyResult = prettier.format(result, { parser: "html" });

      expect(prettyResult).toBe(htmlSource);
    });
  });
});
