// TODO Fix this hack.
const COMMON_HEADERS = {
  "Access-Control-Allow-Headers": "Authorization",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

const LEGAL_REFERENCE_CATEGORY = {
  AGREEMENT: "agreement",
  LABOR_CODE: "labor_code",
};

module.exports = {
  COMMON_HEADERS,
  LEGAL_REFERENCE_CATEGORY,
};
