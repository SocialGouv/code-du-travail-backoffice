// TODO Fix this hack.
const COMMON_HEADERS = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

const LEGAL_REFERENCE_TYPE = {
  AGREEMENT: "agreement",
  LABOR_CODE: "labor_code",
};

module.exports = {
  COMMON_HEADERS,
  LEGAL_REFERENCE_TYPE,
};
