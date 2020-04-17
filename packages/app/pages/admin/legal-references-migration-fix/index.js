import styled from "@emotion/styled";
import * as R from "ramda";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";

import OLD_ANSWERS_REFERENCES from "../../../data/answers_references_snapshot.json";
import * as actions from "../../../src/actions";
import LegalReferences from "../../../src/components/LegalReferences";
import { LEGAL_REFERENCE_CATEGORY } from "../../../src/constants";
import Hr from "../../../src/elements/Hr";
import Idcc from "../../../src/elements/Idcc";
import Select from "../../../src/elements/Select";
import Title from "../../../src/elements/Title";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customPostgrester from "../../../src/libs/customPostgrester";

const Container = styled.div`
  margin: 0 1rem 1rem;
`;
const AnswerTitle = styled(Flex)`
  cursor: pointer;
  margin: 1rem 0 0.5rem;
`;

let AGREEMENT_SELECT_OPTIONS = [];

class LegalReferencesMigrationIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answersWithReferences: [],
      editedAnswerId: null,
      isLoading: false,
      isUpdating: false,
      loadingIdcc: null,
      loadingIndex: null,
      selectedAgreementId: null,
    };
  }

  componentDidMount() {
    if (AGREEMENT_SELECT_OPTIONS.length === 0) {
      this.loadAgreements();
    }
  }

  async loadAgreements() {
    const request = customPostgrester();

    const { data: allLocationsAgreements } = await request.get("/locations_agreements");
    const allLocationsAgreementIds = allLocationsAgreements.map(({ agreement_id }) => agreement_id);
    const { data: allAgreements } = await customPostgrester()
      .in("id", allLocationsAgreementIds)
      .orderBy("idcc")
      .get(`/agreements`);

    AGREEMENT_SELECT_OPTIONS = allAgreements.map(({ id, idcc, name }) => ({
      label: `[${idcc}] ${name}`,
      value: id,
    }));

    this.forceUpdate();
  }

  async loadAnswersForSelectedAgreement(selectedAgreementId) {
    this.setState({ isLoading: true, selectedAgreementId });
    const answersWithReferences = [];
    const request = customPostgrester();

    const { data: answers } = await request
      .select("*")
      .select("agreement(*)")
      .select("question(*)")
      .and.eq("agreement_id", selectedAgreementId)
      .is("is_published", true)
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
        .eq("category", LEGAL_REFERENCE_CATEGORY.AGREEMENT)
        .orderBy("id")
        .get("/answers_references");

      const answerOldReferences = OLD_ANSWERS_REFERENCES.filter(
        ({ answer_id, category }) =>
          answer_id === answer.id && category === LEGAL_REFERENCE_CATEGORY.AGREEMENT,
      );

      answersWithReferences.push({
        ...answer,
        oldReferences: answerOldReferences,
        references: answerReferences,
      });
    }

    this.setState({
      answersWithReferences,
      isLoading: false,
      isUpdating: false,
    });
  }

  updateReference(data) {
    this.setState({
      editedAnswerId: data.answer_id,
      isUpdating: true,
    });

    const { dispatch } = this.props;

    dispatch(
      actions.answers.updateReferences([data], async () => {
        const request = customPostgrester();
        const { answersWithReferences, editedAnswerId } = this.state;

        const { data: updatedAnswerReferences } = await request
          .eq("answer_id", editedAnswerId)
          .eq("category", LEGAL_REFERENCE_CATEGORY.AGREEMENT)
          .orderBy("id")
          .get("/answers_references");

        const updatedAnswersWithReferencesIndex = answersWithReferences.findIndex(
          ({ id }) => id === editedAnswerId,
        );

        answersWithReferences[
          updatedAnswersWithReferencesIndex
        ].references = updatedAnswerReferences;

        this.setState({
          answersWithReferences: [...answersWithReferences],
          editedAnswerId: null,
          isUpdating: false,
        });
      }),
    );
  }

  goTo(path) {
    window.open(path, "_blank");
  }

  async selectAgreement({ value }) {
    await this.loadAnswersForSelectedAgreement(value);
  }

  renderAnswerWithReferences(answerWithReferences) {
    const { agreement, id, oldReferences, question, references } = answerWithReferences;
    const { editedAnswerId, isUpdating } = this.state;

    const isLoading = isUpdating && id === editedAnswerId;

    return (
      <div key={id}>
        <Hr />
        <AnswerTitle alignItems="baseline" onClick={() => this.goTo(`/admin/answers/${id}`)}>
          <Idcc code={agreement.idcc} name={agreement.name} />
          {`${question.index}) ${question.value}`}
        </AnswerTitle>
        <Flex>
          <LegalReferences
            category={LEGAL_REFERENCE_CATEGORY.AGREEMENT}
            isReadOnly
            references={oldReferences}
          />
          <LegalReferences
            category={LEGAL_REFERENCE_CATEGORY.AGREEMENT}
            isEditable
            isLoading={isLoading}
            isReadOnly
            noContent
            onChange={this.updateReference.bind(this)}
            references={references}
          />
        </Flex>
      </div>
    );
  }

  renderAnswersWithReferences() {
    const { answersWithReferences } = this.state;

    return answersWithReferences.map(this.renderAnswerWithReferences.bind(this));
  }

  render() {
    const { isLoading, loadingIdcc, loadingIndex, selectedAgreementId } = this.state;

    return (
      <AdminMainLayout>
        <Container>
          <Title>Différences (26/02/2020)</Title>
          <div>
            {AGREEMENT_SELECT_OPTIONS.length !== 0 ? (
              <Select
                onChange={this.selectAgreement.bind(this)}
                options={AGREEMENT_SELECT_OPTIONS}
              />
            ) : (
              `Chargement des conventions…`
            )}
            {selectedAgreementId !== null && isLoading && (
              <div>
                {`Chargement des références de la réponse à la question n° ${loadingIndex} pour la convention n° ${loadingIdcc}…`}
              </div>
            )}
            {selectedAgreementId !== null && !isLoading && this.renderAnswersWithReferences()}
          </div>
        </Container>
      </AdminMainLayout>
    );
  }
}

export default connect(({ answers, legalReferences }) => ({
  answers,
  legalReferences,
}))(LegalReferencesMigrationIndex);
