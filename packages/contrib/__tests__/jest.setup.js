/* eslint-disable max-len */

process.env.API_URI = "http://localhost:3200";

// Jest "jest-dom" extension
// https://github.com/gnapse/jest-dom#usage
import "@testing-library/jest-dom/extend-expect";

// Jest "snapshot-diff" extension
// https://github.com/jest-community/snapshot-diff#with-custom-matcher
// https://github.com/facebook/create-react-app/issues/2007#issuecomment-296250751
// import expect from "expect";
import { toMatchDiffSnapshot } from "snapshot-diff";
expect.extend({ toMatchDiffSnapshot });

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

// Mock "sessionStorage"
import "../__mocks__/sessionStorage";

// Mock "next/router"
import "../__mocks__/nextRouter";

// Mock "axios"
import "../__mocks__/axios";

// Mock "../src/libs/customAxios"
import "../__mocks__/customAxios";

// Globalize generateTestId() helper
import "../__mocks__/generateTestId";
