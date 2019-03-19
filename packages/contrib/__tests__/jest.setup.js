// Polyfill "MutationObserver"
// https://github.com/megawac/MutationObserver.js
import "mutationobserver-shim";

// Polyfill "document.getSelection()""
// https://gist.github.com/yckart/6435861
Object.defineProperty(document, "getSelection", {
  value: () => {
    return document.selection && document.selection.createRange().text;
  }
});

// Mock "next/router"
import "../__mocks__/nextRouter";

// Mock "next/config"
// TODO Wait for release of: https://github.com/zeit/next.js/pull/6458.
// https://github.com/zeit/next.js/issues/4024#issuecomment-423843420
jest.mock("next/config", () => () => ({
  publicRuntimeConfig: {
    API_URI: "http://localhost:3200"
  }
}));
// https://github.com/zeit/next.js/issues/4024#issuecomment-469204986
jest.mock("next-server/config", () => () => ({
  publicRuntimeConfig: {
    API_URI: "http://localhost:3200"
  }
}));

// Mock "axios"
import "../__mocks__/axios";
