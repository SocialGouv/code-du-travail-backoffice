/**
 * - PERIME: ...
 * - REMPLACE: ...
 * - VIGUEUR: ...
 * - VIGUEUR_ETEN: ...
 * - VIGUEUR_NON_ETEN: ...
 *
 * TODO Check and describe types.
 */
export type ArticleState = "PERIME" | "REMPLACE" | "VIGUEUR" | "VIGUEUR_ETEN" | "VIGUEUR_NON_ETEN";

export interface Article {
  type: "article";
  id: string;
  cid: string;
  index: string | null; // Article index.
  state: ArticleState;
  title: string | null;
  subtitle: string | null;
  content: string; // Article HTML content.
  fullText: string; // Full-text for fuse search purposes.
  isAnnex: boolean; // Is it an addional text article or section?
}
export interface ArticleWithContainerId extends Article {
  agreementId: string | null;
}
