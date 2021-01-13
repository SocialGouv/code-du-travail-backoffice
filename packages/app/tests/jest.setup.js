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
import { matchers } from "@emotion/jest";
expect.extend(matchers);

// Custom matchers:
import "./matchers/toHaveTestRenderedChild";
import "./matchers/toHaveTestRenderedChildLength";
import "./matchers/toHaveTestRenderedClassName";
import "./matchers/toHaveTestRenderedProperty";
import "./matchers/toHaveTestRenderedStyleRule";
import "./matchers/toHaveTestRenderedTextContent";
import "./matchers/toHaveTestRenderedType";

// Mock "next/router"
// import "./mocks/nextRouter";
