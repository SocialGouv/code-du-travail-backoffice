import styled from "@emotion/styled";
import * as R from "ramda";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";

import * as actions from "../../../src/actions";
import LegalReferences from "../../../src/components/LegalReferences";
import { LEGAL_REFERENCE_CATEGORY } from "../../../src/constants";
import Button from "../../../src/elements/Button";
import Hr from "../../../src/elements/Hr";
import Idcc from "../../../src/elements/Idcc";
import Title from "../../../src/elements/Title";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";
import customPostgrester from "../../../src/libs/customPostgrester";

const Container = styled.div`
  margin: 0 1rem 1rem;
`;
const AnswerTitle = styled(Flex)`
  cursor: pointer;
  margin: 1rem 0 0.5rem;
`;

const ANSWER_REFERENCE_CATEGORIES = Object.values(LEGAL_REFERENCE_CATEGORY);

class LegalReferencesMigrationIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answersWithReferences: [],
      currentReferenceId: null,
      isLoading: true,
      loadingIdcc: null,
      loadingIndex: null,
    };
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    this.setState({ isLoading: true });
    const answersWithReferences = [];
    const request = customPostgrester();

    const { data: allLocationsAgreements } = await request.get("/locations_agreements");
    const allLocationsAgreementIds = allLocationsAgreements.map(({ agreement_id }) => agreement_id);
    const { data: allAgreements } = await customPostgrester()
      .in("id", allLocationsAgreementIds)
      .orderBy("idcc")
      .get(`/agreements`);
    const filteredAgreements = [];
    for (const agreement of allAgreements) {
      this.setState({
        loadingIdcc: agreement.idcc,
      });

      if (await this.isReferenced(agreement)) {
        filteredAgreements.push(agreement);
      }
    }
    const filteredAgreementIds = filteredAgreements.map(({ id }) => id);
    const { data: answers } = await request
      .select("*")
      .select("agreement(*)")
      .select("question(*)")
      .in("agreement_id", filteredAgreementIds)
      .get("/answers");

    const sortedAnswers = R.sortWith([
      R.ascend(R.prop("agreementIdcc")),
      R.ascend(R.prop("questionIndex")),
    ])(
      answers.map(answer => ({
        ...answer,
        agreementIdcc: answer.agreement.idcc,
        questionIndex: answer.question.index,
      })),
    );

    for (const answer of sortedAnswers) {
      this.setState({
        loadingIdcc: answer.agreementIdcc,
        loadingIndex: answer.questionIndex,
      });

      const { data: answerReferences } = await request
        .eq("answer_id", answer.id)
        .in("category", ANSWER_REFERENCE_CATEGORIES)
        .is("dila_id", null)
        .is("is_skipped", false)
        .get("/answers_references");

      if (answerReferences.length > 0) {
        let i = answerReferences.length;
        while (--i >= 0) {
          const { category, value } = answerReferences[i];

          let foundReferences;
          if (category === LEGAL_REFERENCE_CATEGORY.AGREEMENT) {
            foundReferences = await this.findReferences(
              category,
              value.replace(/article\s+?/i, ""),
              answer.agreement.idcc,
            );
          } else {
            foundReferences = await this.findReferences(category, value);
          }

          if (foundReferences.length !== 0) {
            answerReferences[i].dila_id = foundReferences[0].id;
          }
        }

        answersWithReferences.push({
          ...answer,
          references: answerReferences,
        });

        this.setState({
          answersWithReferences,
          isLoading: false,
        });

        break;
      }
    }
  }

  async isReferenced({ idcc }) {
    try {
      const { data } = await customAxios().get(
        `/legal-references?idcc=${idcc}&category=${LEGAL_REFERENCE_CATEGORY.AGREEMENT}&query=1`,
      );

      return data.length !== 0;
    } catch (err) {
      return false;
    }
  }

  async findReferences(category, query, idcc) {
    try {
      const { data } = await customAxios().get(
        `/legal-references?idcc=${idcc}&category=${category}&query=${query}`,
      );

      return data;
    } catch (err) {
      return [];
    }
  }

  loadLegalReferences(id, category, query, idcc) {
    const {
      dispatch,
      legalReferences: { isLoading },
    } = this.props;
    if (isLoading) return;

    this.setState({ currentReferenceId: id });

    if (category === LEGAL_REFERENCE_CATEGORY.AGREEMENT) {
      this.props.dispatch(actions.legalReferences.load(category, query, idcc));

      return;
    }

    dispatch(actions.legalReferences.load(category, query));
  }

  updateReference(answersWithReferencesIndex, answerReferenceId, data) {
    this.setState({ currentReferenceId: null });

    const answersWithReferences = [...this.state.answersWithReferences];
    const answerWithReferences = answersWithReferences[answersWithReferencesIndex];
    const referenceIndex = answerWithReferences.references.findIndex(
      ({ id }) => id === answerReferenceId,
    );

    if (typeof data === "undefined") {
      answerWithReferences.references[referenceIndex].dila_id = null;
    } else {
      answerWithReferences.references[referenceIndex].dila_id = data.id;
    }

    this.setState({ answersWithReferences });
  }

  migrateReference(answersWithReferencesIndex, answerReferenceId) {
    const { dispatch } = this.props;
    const { answersWithReferences } = this.state;

    const reference = answersWithReferences[answersWithReferencesIndex].references.find(
      ({ id }) => id === answerReferenceId,
    );
    reference.value = reference.dila_id;
    delete reference.created_at;
    delete reference.updated_at;

    dispatch(actions.answers.updateReferences([reference], this.load.bind(this)));

    this.setState({ answersWithReferences });
  }

  skipReference(answersWithReferencesIndex, answerReferenceId) {
    const { dispatch } = this.props;
    const { answersWithReferences } = this.state;

    const reference = answersWithReferences[answersWithReferencesIndex].references.find(
      ({ id }) => id === answerReferenceId,
    );
    reference.dila_id = null;
    reference.is_skipped = true;
    delete reference.created_at;
    delete reference.updated_at;

    dispatch(actions.answers.updateReferences([reference], this.load.bind(this)));

    this.setState({ answersWithReferences });
  }

  goTo(path) {
    window.open(path, "_blank");
  }

  renderReferences(references, idcc, answersWithReferencesIndex) {
    const { currentReferenceId } = this.state;
    return references.map(({ category, dila_id, id, value }) => {
      const data = id === currentReferenceId ? this.props.legalReferences.data : [];
      const referencesList = dila_id !== null ? [{ id: dila_id, value: dila_id }] : [];

      return (
        <Flex alignItems="center" key={id} style={{ minHeight: "5.5rem" }}>
          <Flex width={0.4}>
            <strong>{value}</strong>
          </Flex>
          <Flex alignItems="flex-start" justifyContent="flex-end" width={0.6}>
            <LegalReferences
              category={category}
              data={data}
              onAdd={data => this.updateReference(answersWithReferencesIndex, id, data)}
              onInput={query => this.loadLegalReferences(id, category, query, idcc)}
              onRemove={() => this.updateReference(answersWithReferencesIndex, id)}
              references={referencesList}
              style={{ flexGrow: 1 }}
            />
            <Button
              color="danger"
              disabled={dila_id === null}
              hasGroup
              onClick={() => this.skipReference(answersWithReferencesIndex, id)}
              style={{ marginLeft: "1rem", minWidth: "5.75rem" }}
            >
              PASSER
            </Button>
            <Button
              disabled={dila_id === null}
              onClick={() => this.migrateReference(answersWithReferencesIndex, id)}
              style={{ minWidth: "5.75rem" }}
            >
              MIGRER
            </Button>
          </Flex>
        </Flex>
      );
    });
  }

  renderAnswerWithReferences(answerWithReferences, index) {
    const { agreement, id, question, references } = answerWithReferences;

    return (
      <div key={id}>
        <Hr />
        <AnswerTitle alignItems="baseline" onClick={() => this.goTo(`/admin/answers/${id}`)}>
          <Idcc code={agreement.idcc} name={agreement.name} />
          {`${question.index}) ${question.value}`}
        </AnswerTitle>
        {this.renderReferences(references, agreement.idcc, index)}
      </div>
    );
  }

  renderAnswersWithReferences() {
    const { answersWithReferences } = this.state;

    return answersWithReferences.map(this.renderAnswerWithReferences.bind(this));
  }

  render() {
    const { isLoading, loadingIdcc, loadingIndex } = this.state;

    if (isLoading) {
      return (
        <AdminMainLayout>
          <Container>
            <Title>Migrations des références juriques</Title>
            <div>
              {loadingIndex === null
                ? `Vérification en cours de la convention n° ${loadingIdcc}…`
                : `Vérification en cours des références de la réponse à la question n° ${loadingIndex} pour la convention n° ${loadingIdcc}…`}
            </div>
          </Container>
        </AdminMainLayout>
      );
    }

    return (
      <AdminMainLayout>
        <Container>
          <Title>Migrations des références juriques</Title>
          {this.renderAnswersWithReferences()}
        </Container>
      </AdminMainLayout>
    );
  }
}

export default connect(({ answers, legalReferences }) => ({
  answers,
  legalReferences,
}))(LegalReferencesMigrationIndex);
