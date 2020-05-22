// Type definitions for @socialgouv/kali-data

/**
 * TODO Check and describe types.
 */
declare module "@socialgouv/kali-data" {
  /**
   * Agreement or Article State.
   *
   * - ABROGE: ...
   * - DENONCE: ...
   * - MODIFIE: ...
   * - PERIME: ...
   * - REMPLACE: ...
   * - VIGUEUR: ...
   * - VIGUEUR_ETEN: ...
   * - VIGUEUR_NON_ETEN: ...
   */
  type State =
    | "ABROGE"
    | "DENONCE"
    | "MODIFIE"
    | "PERIME"
    | "REMPLACE"
    | "VIGUEUR"
    | "VIGUEUR_ETEN"
    | "VIGUEUR_NON_ETEN";

  type IndexAgreement = {
    active?: boolean;
    /** Publication ISO date */
    date_publi?: string;
    effectif?: number;
    etat?: State;
    /** KALI ID */
    id: string;
    mtime?: number;
    nature: "IDCC";
    /** IDCC */
    num: number;
    shortTitle: string;
    texte_de_base?: string;
    title: string;
    url?: string;
  };

  type Agreement = {
    type: "section";
    data: AgreementData;
    children: AgreementSection[];
  };

  type AgreementData = {
    num: number;
    title: string;
    id: string;
    shortTitle: string;
    categorisation: string[];
  };

  type AgreementSection = {
    type: "section";
    data: AgreementSectionData;
    children: (AgreementArticle & AgreementSection)[];
  };

  type AgreementSectionData = {
    intOrdre: number;
    title: string;
    id: string;
    etat: State;
  };

  type AgreementArticle = {
    type: "article";
    data: AgreementArticleData;
  };

  type AgreementArticleData = {
    cid: string;
    intOrdre: number;
    id: string;
    /** Legal index */
    num: string | null;
    /** HTML content */
    content: string;
    etat: State;
    surtitre?: string;
    historique?: string;
    lstLienModification: AgreementArticleDataLinkUpdate[];
  };

  type AgreementArticleDataLinkUpdate = {
    textCid: string;
    textTitle: string;
    linkType:
      | "ABROGATION"
      | "ABROGE"
      | "CREATION"
      | "CREE"
      | "DENONCE"
      | "DENONCIATION"
      | "ELARGISSEMENT"
      | "ELARGIT"
      | "ETEND"
      | "EXTENSION"
      | "MODIFICATION"
      | "MODIFIE"
      | "PEREMPTION"
      | "PERIME";
    linkOrientation: "cible" | "source";
    articleNum: string;
    articleId: string;
    natureText: string;
    /** Publication date (YYYY-MM-DD) */
    datePubliTexte: string | null;
    /** ??? date (YYYY-MM-DD) */
    dateSignaTexte: string | null;
    /** ??? date (YYYY-MM-DD) */
    dateDebutCible: string | null;
  };

  type AgreementArticleOrSection = AgreementArticle | AgreementSection;
}
