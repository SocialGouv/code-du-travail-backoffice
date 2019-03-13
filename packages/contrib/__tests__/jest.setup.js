import { setConfig } from "next/config";

// https://github.com/zeit/next.js/issues/4024#issuecomment-386016077
// TODO Wait for release of: https://github.com/zeit/next.js/pull/6458.
import nextConfig from "../__mocks__/next.config";
setConfig(nextConfig);
