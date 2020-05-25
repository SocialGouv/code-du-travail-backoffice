import jsCookie from "js-cookie";
import Router from "next/router";
import React from "react";

import cache from "../../cache";
import { ANSWER_STATE } from "../../constants";
import Icon from "../../elements/Icon";
import T from "../../texts";
import { Container, Dropdown, DropdownLink, DropdownMenu, DropdownText } from "./styles";

export default class Menu extends React.PureComponent {
  goToAnswers(state) {
    Router.push(`/answers/${state}/1`);
  }

  openDoc(path) {
    window.open(`/static/docs/${path}`, "_blank");
  }

  openGuide(path) {
    window.open(`https://jean-rene-duscher.gitbook.io${path}`, "_blank");
  }

  logOut() {
    jsCookie.remove("jwt");

    window.location.href = "/";
  }

  render() {
    const me = cache.get("me");

    if (me.isAdmin)
      return (
        <Container>
          <Dropdown>
            <DropdownText>{me.data.name}</DropdownText>
            <DropdownMenu>
              <DropdownLink
                data-testid="admin-logout"
                onClick={() => this.logOut()}
                onKeyPress={() => this.logOut()}
                role="link"
                tabIndex="0"
              >
                <Icon icon="sign-out-alt" />
                Se déconnecter
              </DropdownLink>
            </DropdownMenu>
            <Icon icon="caret-down" />
          </Dropdown>
        </Container>
      );

    return (
      <Container>
        <Dropdown>
          <DropdownText>Liste des réponses</DropdownText>
          <DropdownMenu>
            <DropdownLink
              data-testid="contrib-answers-todo"
              onClick={() => this.goToAnswers(ANSWER_STATE.TO_DO)}
              onKeyPress={() => this.goToAnswers(ANSWER_STATE.TO_DO)}
              role="link"
              tabIndex="0"
            >
              {T.ANSWERS_INDEX_TITLE(ANSWER_STATE.TO_DO)}
            </DropdownLink>
            <DropdownLink
              data-testid="contrib-answers-draft"
              onClick={() => this.goToAnswers(ANSWER_STATE.DRAFT)}
              onKeyPress={() => this.goToAnswers(ANSWER_STATE.DRAFT)}
              role="link"
              tabIndex="0"
            >
              {T.ANSWERS_INDEX_TITLE(ANSWER_STATE.DRAFT)}
            </DropdownLink>
            <DropdownLink
              data-testid="contrib-answers-under-review"
              onClick={() => this.goToAnswers(ANSWER_STATE.UNDER_REVIEW)}
              onKeyPress={() => this.goToAnswers(ANSWER_STATE.UNDER_REVIEW)}
              role="link"
              tabIndex="0"
            >
              {T.ANSWERS_INDEX_TITLE(ANSWER_STATE.UNDER_REVIEW)}
            </DropdownLink>
            <DropdownLink
              data-testid="contrib-answers-validated"
              onClick={() => this.goToAnswers(ANSWER_STATE.VALIDATED)}
              onKeyPress={() => this.goToAnswers(ANSWER_STATE.VALIDATED)}
              role="link"
              tabIndex="0"
            >
              {T.ANSWERS_INDEX_TITLE(ANSWER_STATE.VALIDATED)}
            </DropdownLink>
          </DropdownMenu>
          <Icon icon="caret-down" />
        </Dropdown>
        <Dropdown>
          <DropdownText>Aide</DropdownText>
          <DropdownMenu>
            <DropdownLink
              data-testid="contrib-guide"
              onClick={() => this.openGuide("/code-du-travail-numerique/")}
              onKeyPress={() => this.openGuide("/code-du-travail-numerique/")}
              role="link"
              tabIndex="0"
            >
              <Icon icon="book" />
              Guide : Outil de contribution
            </DropdownLink>

            <DropdownLink
              data-testid="contrib-charter"
              onClick={() => Router.push("/charter")}
              onKeyPress={() => Router.push("/charter")}
              role="link"
              tabIndex="0"
            >
              <Icon icon="file-pdf" />
              Charte rédactionnelle
            </DropdownLink>

            <DropdownLink
              data-testid="contrib-proposal"
              onClick={() =>
                this.openDoc("Proposition-de-reponse-types-CC-metallurgie-locales.docx")
              }
              onKeyPress={() =>
                this.openDoc("Proposition-de-reponse-types-CC-metallurgie-locales.docx")
              }
              role="link"
              tabIndex="0"
            >
              <Icon icon="file-word" />
              Proposition de réponses-types CC métallurgie locales
            </DropdownLink>

            <DropdownLink
              data-testid="contrib-reformulation"
              onClick={() => this.openDoc("Reformulation-des-intitules-de-question.xlsx")}
              onKeyPress={() => this.openDoc("Reformulation-des-intitules-de-question.xlsx")}
              role="link"
              tabIndex="0"
            >
              <Icon icon="file-excel" />
              Reformulation des intitulés de question
            </DropdownLink>

            <DropdownLink
              data-testid="contrib-feedback"
              onClick={() =>
                this.openDoc("Premiers-retours-sur-la-validation-des-contributions.docx")
              }
              onKeyPress={() =>
                this.openDoc("Premiers-retours-sur-la-validation-des-contributions.docx")
              }
              role="link"
              tabIndex="0"
            >
              <Icon icon="file-word" />
              Premiers retours sur la validation des contributions
            </DropdownLink>
          </DropdownMenu>
          <Icon icon="caret-down" />
        </Dropdown>
        <Dropdown>
          <DropdownText>{me.data.name}</DropdownText>
          <DropdownMenu>
            <DropdownLink
              data-testid="contrib-logout"
              onClick={() => this.logOut()}
              onKeyPress={() => this.logOut()}
              role="link"
              tabIndex="0"
            >
              <Icon icon="sign-out-alt" />
              Se déconnecter
            </DropdownLink>
          </DropdownMenu>
          <Icon icon="caret-down" />
        </Dropdown>
      </Container>
    );
  }
}
