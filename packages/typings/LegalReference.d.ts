import * as KaliData from "@socialgouv/kali-data";

export as namespace LegalReference;

interface Article {
  /** DILA container ID */
  agreementId: string | null;
  /** DILA CID */
  cid: string;
  /** Plain text content */
  content: string;
  /** Full-text for fuse search purposes */
  fullText: string;
  id: string;
  /** Legal index */
  index: string | null; // Article index.
  /** Is it an addional text article or section? */
  isAnnex: boolean;
  state: KaliData.State;
  subtitle: string | null;
  title: string | null;
  type: "article";
}
