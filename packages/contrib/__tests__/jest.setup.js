// MutationObserver polyfill
// https://github.com/megawac/MutationObserver.js
import "mutationobserver-shim";

// https://github.com/zeit/next.js/issues/4024#issuecomment-386016077
// TODO Wait for release of: https://github.com/zeit/next.js/pull/6458.
import { setConfig } from "next/config";
import nextConfig from "../__mocks__/next.config";
setConfig(nextConfig);

// Mock next/router
import "../__mocks__/nextRouter";

// Polyfill for document.getSelection()
// https://gist.github.com/yckart/6435861
Object.defineProperty(document, "getSelection", {
  value: () => {
    return document.selection && document.selection.createRange().text;
  }
});
