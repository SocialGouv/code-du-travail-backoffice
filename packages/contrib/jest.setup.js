/* eslint-disable max-len */

process.env.API_URI = "http://localhost:3200";

// Jest "dom" extension
// https://github.com/gnapse/jest-dom#usage
import "@testing-library/jest-dom/extend-expect";

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

// Polyfill "MutationObserver"
// https://github.com/megawac/MutationObserver.js
import "mutationobserver-shim";

// Mock "sessionStorage"
// import "../__mocks__/sessionStorage";

// Mock "next/router"
import "./__mocks__/nextRouter";

// Mock "axios"
import "./__mocks__/axios";

// Mock "../src/libs/customAxios"
import "./__mocks__/customAxios";

// Globalize generateTestId() helper
import "./__mocks__/generateTestId";
