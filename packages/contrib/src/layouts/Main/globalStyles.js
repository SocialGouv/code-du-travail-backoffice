/* eslint-disable max-len */

import css from "styled-jsx/css";

/**
 * @see https://github.com/SocialGouv/code-du-travail-numerique/tree/master/packages/code-du-travail-css
 * @see https://coolors.co/253031-315659-2978a0-bcab79-c6e0ff
 *
 * TODO Clean global styles.
 * TODO Remove Quill Editor styles overrides.
 */
export default css.global`
  /* ———————————————————————————————————————————————————————————————————————————
    Global CDTN Styles
  */

  @font-face {
    font-family: Muli;
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src: url(/static/fonts/muli-latin-400.woff2) format("woff2"),
      url(/static/fonts/muli-latin-400.woff) format("woff");
  }

  @font-face {
    font-family: Muli;
    font-style: normal;
    font-display: swap;
    font-weight: 600;
    src: url(/static/fonts/muli-latin-600.woff2) format("woff2"),
      url(/static/fonts/muli-latin-600.woff) format("woff");
  }

  @font-face {
    font-family: Muli;
    font-style: normal;
    font-display: swap;
    font-weight: 700;
    src: url(/static/fonts/muli-latin-700.woff2) format("woff2"),
      url(/static/fonts/muli-latin-700.woff) format("woff");
  }

  :root {
    --color-black: #0c0c0e;
    --color-almost-black: #26353f;
    --color-blue: #0053b3;
    --color-blue-light: #006be6;
    --color-blue-dark: #003b80;
    --color-element-background: #f5f7fa;
    --color-element-border: #c9d3df;
    --color-white: #fff;
    --color-lighter-grey: #ebeff3;
    --color-light-grey: #c9d3df;
    --color-grey: #adb9c9;
    --color-dark-grey: #8393a7;
    --color-darker-grey: #53657d;
    --color-title: #006ab2;
    --color-light-background: #f9f9fc;
    --color-light-text: #4c5467;
    --color-dark-background: #ebeff3;
    --color-dark-text: #434956;
    --color-primary-background: #005994;
    --color-primary-text: #fff;
    --color-primary-text: var(--color-white);
    --color-secondary-background: #eaeaea;
    --color-secondary-text: #0c0c0e;
    --color-secondary-text: var(--color-black);
    --color-success-background: #e0f2bd;
    --color-success-text: #0c0c0e;
    --color-success-text: var(--color-black);
    --color-info-background: #d7e8f9;
    --color-info-text: #0c0c0e;
    --color-info-text: var(--color-black);
    --color-warning-background: #fee5ad;
    --color-warning-text: #0c0c0e;
    --color-warning-text: var(--color-black);
    --color-danger-background: #f6bcc2;
    --color-danger-text: #0c0c0e;
    --color-danger-text: var(--color-black);
    --color-mark-background: #fff28e;
    --color-focus: #80bdff;
    --color-focus-shadow: #bfdeff;
    --bp-desktop: 1200px;
    --bp-tablet: 980px;
    --bp-mobile: 600px;
    --border-radius-base: 0.25rem;
    --spacing-xsmall: 0.5rem;
    --spacing-small: 0.625rem;
    --spacing-base: 1rem;
    --spacing-medium: 1.25rem;
    --spacing-large: 2.5em;
    --spacing-inter-component: 1.25rem;
    --spacing-inter-component: var(--spacing-medium);
    --font-size-base: 1rem;
    --line-height-base: 1.4;
    --font-size-xsmall: 0.8rem;
    --font-size-small: 0.9rem;
    --font-size-h1: 1.6rem;
    --font-size-h2: 1.5rem;
    --font-size-h3: 1.4rem;
    --font-size-h4: 1.3rem;
    --font-size-h5: 1.2rem;
    --font-size-h6: 1.1rem;
    --box-shadow-bottom: 0 10px 10px -10px #b7bcdf;
    --box-shadow: 0 5px 10px 0 #c9d3df;
    --box-shadow: 0 5px 10px 0 var(--color-light-grey);
  }

  :focus {
    outline: 1px solid var(--color-outline);
    -webkit-box-shadow: 0 0 0.15rem 0.15rem #bfdeff;
    box-shadow: 0 0 0.15rem 0.15rem #bfdeff;
    -webkit-box-shadow: 0 0 0.15rem 0.15rem var(--color-focus-shadow);
    box-shadow: 0 0 0.15rem 0.15rem var(--color-focus-shadow);
  }
  *,
  :after,
  :before {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    border-top: 5px solid #0053b3;
    border-top: 5px solid var(--color-blue);
    font-size: 1rem;
    font-size: var(--font-size-base);
  }

  html {
    color: #434956;
    color: var(--color-dark-text);
    background: #ebeff3;
    background: var(--color-dark-background);
    font-family: Muli, -apple-system, BlinkMacSystemFont, Helvetica Neue,
      Helvetica, Arial, sans-serif;
    line-height: 1.4;
    line-height: var(--line-height-base);
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
  }

  main {
    color: #4c5467;
    color: var(--color-light-text);
    background: #f9f9fc;
    background: var(--color-light-background);
  }

  address,
  blockquote,
  dl,
  fieldset,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  ol,
  p,
  pre,
  table,
  ul {
    margin-top: 0;
    margin-bottom: 1.25rem;
    margin-bottom: var(--spacing-medium);
  }

  /* ———————————————————————————————————————————————————————————————————————————
    Custom Back-Office Styles
  */

  :root {
    /* Original shades */
    --color-black-leather-jacket: #253031;
    --color-dark-slate-gray: #315659;
    --color-lapis-lazuli: #2978a0;
    --color-misty-moss: #bcab79;
    --color-periwinkle: #c6e0ff;

    /* Light shades */
    --color-mummy-tomb: #888e8e;
    --color-silver-sand: #b4c1c2;
    --color-light-steel-blue: #b1cddc;
    --color-pearl: #e6e0ce;
    --color-alice-blue: #eaf3ff;

    /* Dark shades */
    --color-eerie-black: #151b1b;
    --color-japenese-indigo: #243f41;
    --color-blue-sapphire: #1e5875;
    --color-shadow: #897d59;
    --color-cadet-grey: #91a3ba;

    /* Transition design colors */
    --color-black-leather-jacket: #000000;
    --color-background: #f9f9fc;
    --color-border: #c9d3df;
    --color-label-background: #eeeeef;
    --color-text-gray: #929292;
    --color-text-blue: #2f80ed;
    --color-text-red: #c3622a;
    --color-placeholder: var(--color-text-gray);
  }

  html,
  body {
    overflow: hidden;
  }

  body {
    background-color: var(--color-background);
    border-top: 0;
    color: var(--color-black-leather-jacket);
    overflow-x: hidden;
  }

  *:focus {
    box-shadow: initial !important;
  }

  /* ———————————————————————————————————————————————————————————————————————————
    Quill Editor Custom Styles
  */

  .ql-editor p {
    margin-top: 0 !important;
    margin-bottom: 1.25rem !important;
    margin-bottom: var(--spacing-medium) !important;
  }

  .ql-toolbar.ql-snow {
    background-color: white !important;
    border-right: 0 !important;
    border-left: 0 !important;
  }

  .ql-toolbar.ql-snow + .ql-container.ql-snow {
    background-color: #f3f3f3 !important;
    border: 0 !important;
    display: flex !important;
    justify-content: center !important;
    padding: 2rem !important;
  }

  .ql-editor {
    background-color: white !important;
    border: 1px solid #cbcbcb !important;
    max-width: 50rem !important;
    padding: 1rem;
    width: 100% !important;
  }
`;
