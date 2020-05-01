/* eslint-disable simple-import-sort/sort */
/* eslint-env browser */

// Jest "dom" extension
// https://github.com/gnapse/jest-dom#usage
import "@testing-library/jest-dom/extend-expect";

// Polyfill "MutationObserver"
// https://github.com/megawac/MutationObserver.js
import "mutationobserver-shim";

// Jest "snapshot-diff" extension
// https://github.com/jest-community/snapshot-diff#with-custom-matcher
// https://github.com/facebook/create-react-app/issues/2007#issuecomment-296250751
// import expect from "expect";
import { toMatchDiffSnapshot } from "snapshot-diff";
expect.extend({ toMatchDiffSnapshot });

// Jest "emotion" extension
// https://github.com/emotion-js/emotion/tree/master/packages/jest-emotion#custom-matchers
// import expect from "expect";
import { matchers } from "jest-emotion";
expect.extend(matchers);

// Custom matchers:
import "./matchers/toHaveTestRenderedClass";
import "./matchers/toHaveTestRenderedProp";

// Mock "next/router"
import "./mocks/nextRouter";
// Mock "axios"
import "./mocks/axios";
// Mock "../src/libs/customAxios"
import "./mocks/customAxios";
// Globalize console() overwriting
import "./globals/console";
// Globalize testRender() helper
import "./globals/testRender";
// Globalize waitFor() helper
import "./globals/waitFor";
