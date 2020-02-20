/* eslint-disable max-len */
/* eslint-disable prettier/prettier */

import { ANSWER_STATE_LABEL } from "./constants";

export const capitalize = text => text.charAt(0).toLocaleUpperCase() + text.slice(1);
export const isVowel = word => /^[aeéèhiouy]/i.test(word);
export const pluralize = word => word.replace(/([a-zéêè])(?![a-zéêè])/gi, "$1s");

export const cet$ = (_S, _F) => (_F ? "cette" : isVowel(_S) ? "cet" : "ce");
export const du$ = (_S, _F) => (isVowel(_S) ? "de l'" : _F ? "de la " : "du ");
export const le$ = (_S, _F) => (isVowel(_S) ? "l'" : _F ? "la " : "le ");
export const nouveau$ = (_S, _F) => (_F ? "nouvelle" : isVowel(_S) ? "nouvel" : "nouveau");
export const un$ = (_S, _F) => (_F ? "une" : "un");
export const un$nouveau$ = (_S, _F) => `${un$(_S, _F)} ${nouveau$(_S, _F)}`;

export default {
  ADMIN_ANSWERS_BUTTON_CANCEL_LABEL: `Refuser la réponse.`,
  ADMIN_ANSWERS_BUTTON_PENDING_REVIEW_LABEL: `Passer la réponse en validation.`,
  ADMIN_ANSWERS_BUTTON_VALIDATE_LABEL: `Valider la réponse.`,
  ADMIN_ANSWERS_COMMENT_PLACEHOLDER:
    `Écrivez votre commentaire ici…\n\n` +
    `CTRL + ENTRÉE pour envoyer le commentaire.\n` +
    `MAJ + ENTRÉE pour passer mode public / privé.`,
  ADMIN_ANSWERS_INFO_NO_DATA: `Aucune réponse ne correspond à ces filtres.`,
  ADMIN_ANSWERS_SEARCH_PLACEHOLDER: `Rechercher par question, réponse, utilisateur ou convention…`,

  ADMIN_COMMON_BUTTON_CANCEL_DELETION_TITLE: (_S, _F) =>
    `Bouton annulant la suppression de ${cet$(_S, _F)} ${_S}`,
  ADMIN_COMMON_BUTTON_CANCEL_FORM_TITLE: _S =>
    `Bouton redirigeant vers la liste des ${pluralize(_S)}`,
  ADMIN_COMMON_BUTTON_CONFIRM_DELETION_TITLE: (_S, _F) =>
    `Bouton confirmant la suppression de ${cet$(_S, _F)} ${_S}`,
  ADMIN_COMMON_BUTTON_CREATE_TITLE: (_S, _F) =>
    `Bouton créant ${un$nouveau$(_S, _F)} ${_S} à partir des données du formulaire`,
  ADMIN_COMMON_BUTTON_DELETE_TITLE: (_S, _F) =>
    `Bouton supprimant ${cet$(_S, _F)} ${_S} après confirmation`,
  ADMIN_COMMON_BUTTON_EDIT_TITLE: (_S, _F) =>
    `Bouton redirigeant vers le formulaire d'édition de ${cet$(_S, _F)} ${_S}`,
  ADMIN_COMMON_BUTTON_NEW_LABEL: (_S, _F) => `${capitalize(nouveau$(_S, _F))} ${_S}`,
  ADMIN_COMMON_BUTTON_NEW_TITLE: (_S, _F) =>
    `Bouton redirigeant vers le formulaire de création d'${un$nouveau$(_S, _F)} ${_S}`,
  ADMIN_COMMON_BUTTON_UPDATE_TITLE: (_S, _F, name) =>
    `Bouton mettant à jour ${le$(_S, _F)}${_S} ${name} à partir des données du formulaire`,
  ADMIN_COMMON_FORM_EDIT_TITLE: (_S, _F, name) => `Édition ${du$(_S, _F)}${_S} « ${name} »`,
  ADMIN_COMMON_FORM_NEW_TITLE: (_S, _F) => `${capitalize(nouveau$(_S, _F))} ${_S}`,
  ADMIN_COMMON_INDEX_TITLE: _S => `Liste des ${pluralize(_S)}`,

  ANSWERS_INDEX_HELP_TO_DO: `Sélectionnez une question et commencez à rédiger la réponse pour vous l'attribuer :`,
  ANSWERS_INDEX_INFO_NO_DATA: state => `Il n'y a aucune réponse ${ANSWER_STATE_LABEL[state]}.`,
  ANSWERS_INDEX_INFO_NO_SEARCH_RESULT: `Cette recherche n'a retournée aucun résultat.`,
  ANSWERS_INDEX_MODAL_CANCEL: `Êtes-vous sûr d'annuler cette réponse (son contenu sera supprimé) ?`,
  ANSWERS_INDEX_SEARCH_PLACEHOLDER: `Rechercher par intitulé de question ou IDCC…`,
  ANSWERS_INDEX_TITLE: state => `Réponses ${ANSWER_STATE_LABEL[state]}`,
};
