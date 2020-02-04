import markdown from "../markdown";

// TODO Check sanitization.
describe("lib/Markdown", () => {
  it("should return an instance of Markdown", () => {
    expect(markdown.constructor.name).toBe("Markdown");
  });

  const htmlSource = `<h2>Ceci est un titre</h2>
<h3>Ceci est un sous-titre</h3>
<p>Ceci est un paragraphe<br />
sur plusieurs<br />
lignes</p>
<blockquote>
  <p>Ceci est une citation.</p>
</blockquote>
<p>Ceci est <em>un texte en italique</em>.</p>
<p>Ceci est <u>un texte souligné</u>.</p>
<p>Ceci est <strong>un texte en gras</strong>.</p>
<p>Ceci est <a href="https://www.example.com">un lien</a>.</p>
<ul>
<li>Ceci est une</li>
<li>Liste ordonnée</li>
</ul>
<ol>
<li>Ceci est une</li>
<li>Liste numérotée</li>
</ol>`;

  const markdownSource = `## Ceci est un titre

### Ceci est un sous-titre

Ceci est un paragraphe<br>
sur plusieurs<br>
lignes

> Ceci est une citation.

Ceci est *un texte en italique*.

Ceci est <u>un texte souligné</u>.

Ceci est **un texte en gras**.

Ceci est [un lien](<https://www.example.com>).

- Ceci est une
- Liste ordonnée

1. Ceci est une
2. Liste numérotée`;

  describe("#fromHtml()", () => {
    it("should return the expected Markdown string", () => {
      expect(markdown.fromHtml(htmlSource)).toBe(markdownSource);
    });
  });

  describe("#toHtml()", () => {
    it("should return the expected Markdown string", () => {
      expect(markdown.toHtml(markdownSource)).toBe(htmlSource);
    });
  });
});
