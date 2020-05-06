/* eslint-disable simple-import-sort/sort */

// Jest "dom" extension
// https://github.com/gnapse/jest-dom#usage
import "@testing-library/jest-dom/extend-expect";

// Polyfill "MutationObserver"
// https://github.com/megawac/MutationObserver.js
import "mutationobserver-shim";

// Jest "emotion" extension
// https://github.com/emotion-js/emotion/tree/master/packages/jest-emotion#custom-matchers
// import expect from "expect";
import { matchers } from "jest-emotion";
expect.extend(matchers);

// Custom matchers:
import "./matchers/toHaveTestRenderedChildrenTimes";
import "./matchers/toHaveTestRenderedClass";
import "./matchers/toHaveTestRenderedProp";
import "./matchers/toHaveTestRenderedText";

// Mock "next/router"
import "./mocks/nextRouter";
// Globalize testRender() helper
import "./globals/testRender";
// Globalize waitFor() helper
import "./globals/waitFor";
