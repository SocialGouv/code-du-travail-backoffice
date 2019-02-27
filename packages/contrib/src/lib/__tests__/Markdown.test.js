import Markdown from "../Markdown";

// TODO Check sanitization.
describe("lib/Markdown", () => {
  const markdown = new Markdown();

  it("should return an instance of Markdown", () => {
    expect(markdown.constructor.name).toBe("Markdown");
  });

  const htmlSource = `<h2>Guerre et Paix</h2>
<h3>Citation</h3>
<blockquote>
  <p>Il m'est arrivé de sentir que tout allait bien pour moi, que tout le<br />
  monde était gai, et aussitôt l'idée me traversait l'esprit qu'il ne se<br />
  passerait plus rien et que tout était absurde.</p>
</blockquote>
<p><em>Léon Tolstoï</em></p>
<p>Ceci est <u>important</u>.</p>
<p>Ceci est <strong>très important</strong>.</p>`;

  // Be careful here! There are 2 spaces ending each of the 2 first lines within
  // the quote block to indicate a line break (<br>).
  const markdownSource = `## Guerre et Paix

### Citation

> Il m'est arrivé de sentir que tout allait bien pour moi, que tout le<br>
> monde était gai, et aussitôt l'idée me traversait l'esprit qu'il ne se<br>
> passerait plus rien et que tout était absurde.

*Léon Tolstoï*

Ceci est <u>important</u>.

Ceci est **très important**.`;

  describe("#fromHtml()", () => {
    it("should return the expected Markdown string", () => {
      expect(markdown.fromHtml(htmlSource)).toBe(markdownSource);
    });
  });

  describe("#fromHtml()", () => {
    it("should return the expected Markdown string", () => {
      expect(markdown.toHtml(markdownSource)).toBe(htmlSource);
    });
  });
});
