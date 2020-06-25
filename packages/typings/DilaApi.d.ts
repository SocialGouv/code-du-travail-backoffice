// https://github.com/SocialGouv/cdtn-api/blob/master/src/index.d.ts

declare namespace DilaApi {
  type Article = {
    /** DILA ID. */
    cid: string;
    /** Agreement or Code DILA ID. */
    containerId: string;
    /** Plain text content. */
    content: string;
    /** DILA CID. */
    id: string;
    /**
     * Index.
     *
     * @example
     * - "12"
     * - "1.2.3"
     * - "L1234-5"
     */
    index: string;
    /** Sections path. */
    path: string;
  };
}
