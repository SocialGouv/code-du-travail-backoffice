import React from "react";
import Medixtor from "react-medixtor";
import { connect } from "react-redux";
import { Flex } from "rebass";
import styled from "@emotion/styled";

import * as actions from "../../src/actions";
import Reference from "../../src/components/Reference";
import Hr from "../../src/elements/Hr";
import Idcc from "../../src/elements/Idcc";
import Subtitle from "../../src/elements/Subtitle";
import Title from "../../src/elements/Title";
import Main from "../../src/layouts/Main";
import customAxios from "../../src/libs/customAxios";

import { ANSWER_STATE } from "../../src/constants";

const Container = styled(Main)`
  overflow-y: auto;
  padding: 1rem;
`;

const AnswerEditor = styled(Medixtor)`
  border: solid 1px var(--color-border) !important;
  border-radius: 0.25rem;
  flex-grow: unset;
  min-height: 15rem;

  .editor {
    background-color: white;
  }
  .editor-status {
    display: none;
  }

  .preview {
    background-color: white;
    border-bottom-right-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    line-height: 1.4;
    min-width: 100% !important;
    overflow-y: auto;
    padding-top: 0 !important;
    width: 100% !important;

    a {
      color: #0053b3;

      :after {
        content: "";
        position: relative;
        top: 1px;
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-left: 5px;
        background: url("/static/assets/icons/external-link.svg") 100% 50% / 15px no-repeat;
      }

      :hover {
        text-decoration: none;
      }
    }

    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #006ab2;
    }
    h2 {
      font-size: 1.875rem;
    }
    h3 {
      font-size: 1.625rem;
    }
    h4 {
      font-size: 1.375rem;
    }
    h5 {
      font-size: 1.125rem;
    }
    h6 {
      font-size: 1rem;
    }

    p {
      color: #434956;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
    }

    ul {
      list-style-type: disc;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      padding-inline-start: 20px;

      li {
        display: list-item;
      }

      ul {
        list-style-type: circle;
      }
    }
  }
`;

const Strong = styled.p`
  font-weight: 600;
  margin: ${props => (Boolean(props.isFirst) ? "0 0 0.5rem" : "1rem 0 0.5rem")};
`;

class AnswersViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      references: []
    };
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  async componentDidMount() {
    this.axios = customAxios();

    this.load();
    await this.loadReferences();
  }

  load() {
    const { dispatch, id } = this.props;

    dispatch(actions.answers.loadOne(id));
  }

  async loadReferences() {
    try {
      const referencesSelect = `select=*`;
      const referencesWhere = `answer_id=eq.${this.props.id}`;
      /* eslint-disable-next-line max-len */
      const referencesUri = `/answers_references?${referencesSelect}&${referencesWhere}`;
      const { data: references } = await this.axios.get(referencesUri);

      this.setState({
        references,
        isLoading: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  renderReferences(category = null) {
    const references = this.state.references.filter(
      ({ category: _category }) => _category === category
    );

    if (references.length === 0) {
      return <span>Aucune référence.</span>;
    }

    return references.map(({ url, value }, index) => (
      <Reference key={index} onRemove={() => void 0} url={url} value={value} />
    ));
  }

  render() {
    const { answers } = this.props;
    const { isLoading } = this.state;

    if (isLoading || answers.isLoading) {
      return <Main isLoading />;
    }

    const { agreement, generic_reference, prevalue, question, state, value } = answers.data;

    const finalValue = state === ANSWER_STATE.VALIDATED ? value : prevalue;
    const valueTitle = state === ANSWER_STATE.VALIDATED ? "Réponse validée" : "Réponse proposée";

    return (
      <Container style={{ padding: "1rem" }}>
        <Flex alignItems="baseline">
          {this.isGeneric ? <Idcc /> : <Idcc code={agreement.idcc} name={agreement.name} />}
          <Title isFirst>{`${question.index}) ${question.value}`}</Title>
        </Flex>
        <Hr />

        <Subtitle isFirst>{valueTitle}</Subtitle>
        <AnswerEditor defaultValue={finalValue} disabled headersOffset={2} isSingleView />

        <Subtitle>Références juridiques</Subtitle>
        <Strong>Convention collective</Strong>
        <Flex flexWrap="wrap">{this.renderReferences("agreement")}</Flex>
        <Strong>Code du travail</Strong>
        <Flex flexWrap="wrap">{this.renderReferences("labor_code")}</Flex>
        <Strong>Autres</Strong>
        <Flex flexWrap="wrap">{this.renderReferences()}</Flex>
        <Hr />

        <Subtitle isFirst>Renvoi</Subtitle>
        {
          {
            labor_code: "Renvoyée au texte Code du Travail.",
            national_agreement: "Renvoyée au texte de la CCN.",
            null: "Aucun renvoi."
          }[String(generic_reference)]
        }
      </Container>
    );
  }
}

export default connect(({ answers }) => ({ answers }))(AnswersViewPage);
