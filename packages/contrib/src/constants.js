import capitalize from "./helpers/capitalize";

export const ANSWER_GENERIC_REFERENCE = {
  LABOR_CODE: "labor_code",
  NATIONAL_AGREEMENT: "national_agreement"
};
export const ANSWER_STATE = {
  TO_DO: "todo",
  DRAFT: "draft",
  PENDING_REVIEW: "pending_review",
  UNDER_REVIEW: "under_review",
  VALIDATED: "validated"
};
export const ANSWER_STATE_LABEL = {
  todo: "à rédiger",
  draft: "en cours de rédaction",
  pending_review: "en attente de validation",
  under_review: "en cours de validation",
  validated: "validée"
};
export const ANSWER_STATES = Object.keys(ANSWER_STATE_LABEL);
export const ANSWER_STATE_OPTIONS = ANSWER_STATES.map(state => ({
  label: capitalize(ANSWER_STATE_LABEL[state]),
  value: state
}));

export const ANSWER_REFERENCE_CATEGORY = {
  AGREEMENT: "agreement",
  LABOR_CODE: "labor_code"
};

export const AREA_CATEGORY_LABEL = {
  department: "Département",
  overseas_collectivity: "Collectivité d'Outre-Mer",
  region: "Région",
  sui_generis_collectivity: "Collectivité Sui Generis"
};

export const USER_ROLE = {
  ADMINISTRATOR: "administrator",
  CONTRIBUTOR: "contributor",
  REGIONAL_ADMINISTRATOR: "regional_administrator"
};
