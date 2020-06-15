import capitalize from "./helpers/capitalize";

export const ANSWER_GENERIC_REFERENCE = {
  LABOR_CODE: "labor_code",
  NATIONAL_AGREEMENT: "national_agreement",
};
export const ANSWER_GENERIC_REFERENCES = Object.values(ANSWER_GENERIC_REFERENCE);

/* eslint-disable sort-keys-fix/sort-keys-fix */
export const ANSWER_STATE = {
  TO_DO: "todo",
  DRAFT: "draft",
  PENDING_REVIEW: "pending_review",
  UNDER_REVIEW: "under_review",
  VALIDATED: "validated",
};
export const ANSWER_STATE_LABEL = {
  todo: "à rédiger",
  draft: "en cours de rédaction",
  pending_review: "en attente de validation",
  under_review: "en cours de validation",
  validated: "validée",
};
export const ANSWER_STATES = Object.values(ANSWER_STATE);
export const ANSWER_STATE_OPTIONS = ANSWER_STATES.map((state, index) => ({
  label: `${index + 1}. ${capitalize(ANSWER_STATE_LABEL[state])}`,
  value: state,
}));
/* eslint-enable sort-keys-fix/sort-keys-fix */

export const ANSWER_REFERENCE_CATEGORY = {
  AGREEMENT: "agreement",
  LABOR_CODE: "labor_code",
  OTHER: "other",
};
export const ANSWER_REFERENCE_CATEGORY_LABEL = {
  agreement: "Convention collective",
  labor_code: "Code du travail",
  other: "Autre",
};
export const ANSWER_REFERENCE_CATEGORIES = Object.values(ANSWER_REFERENCE_CATEGORY);
export const ANSWER_REFERENCE_CATEGORY_OPTIONS = ANSWER_REFERENCE_CATEGORIES.map(category => ({
  label: ANSWER_REFERENCE_CATEGORY_LABEL[String(category)],
  value: category,
}));

export const ANSWER_REFERENCE_STATE = {
  IS_LINKED: "IS_LINKED",
  IS_MIGRATED: "IS_MIGRATED",
  IS_SKIPPED: "IS_SKIPPED",
  NOT_IS_LINKED: "NOT_IS_LINKED",
  NOT_IS_MIGRATED: "NOT_IS_MIGRATED",
  NOT_IS_SKIPPED: "NOT_IS_SKIPPED",
};
export const ANSWER_REFERENCE_STATE_LABEL = {
  IS_LINKED: "liée",
  IS_MIGRATED: "migrée",
  IS_SKIPPED: "passée",
  NOT_IS_LINKED: "non liée",
  NOT_IS_MIGRATED: "non migrée",
  NOT_IS_SKIPPED: "non passée",
};
export const ANSWER_REFERENCE_STATES = Object.values(ANSWER_REFERENCE_STATE);
export const ANSWER_REFERENCE_STATE_OPTIONS = ANSWER_REFERENCE_STATES.map(state => ({
  label: capitalize(ANSWER_REFERENCE_STATE_LABEL[state]),
  value: state,
}));

export const AREA_CATEGORY_LABEL = {
  department: "Département",
  overseas_collectivity: "Collectivité d'Outre-Mer",
  region: "Région",
  sui_generis_collectivity: "Collectivité Sui Generis",
};

export const LEGAL_REFERENCE_CATEGORY = {
  AGREEMENT: "agreement",
  LABOR_CODE: "labor_code",
};
export const LEGAL_REFERENCE_CATEGORIES = Object.values(LEGAL_REFERENCE_CATEGORY);

export const LOG_METHOD = {
  DELETE: "delete",
  PATCH: "patch",
  POST: "post",
};

export const SESSION = {
  ANSWERS_FILTERS: "history.answers.filters",
  ANSWERS_REFERENCES_FILTERS: "history.answersReferences.filters",
  GENERIC_ANSWERS_FILTERS: "history.genericAnswers.filters",
};

export const USER_ROLE = {
  ADMINISTRATOR: "administrator",
  CONTRIBUTOR: "contributor",
  REGIONAL_ADMINISTRATOR: "regional_administrator",
};
