import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

import LegalReferenceTag from "../../../src/components/LegalReferences/Tag";
import * as C from "../../../src/constants";
import Button from "../../../src/elements/Button";
import Idcc from "../../../src/elements/Idcc";
import LoadingSpinner from "../../../src/elements/LoadingSpinner";
import Title from "../../../src/elements/Title";
import shortenAgreementName from "../../../src/helpers/shortenAgreementName";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customPostgrester from "../../../src/libs/customPostgrester";
import dilaApi from "../../../src/libs/dilaApi";
import T from "../../../src/texts";

const Container = styled(Flex)`
  margin: 0 1rem 1rem;
`;

const List = styled(Flex)`
  flex-grow: 1;
  padding-right: 0.5rem;
  min-height: 0;
  overflow-y: auto;
`;
const ListRow = styled(Flex)`
  background-color: white;
  border: solid 1px var(--color-border);
  border-radius: 0.4rem;
  margin-top: 0.5rem;
  padding: 0 0.75rem 0.5rem;
`;
export const OpenButton = styled(Button)`
  font-size: 0.875rem;

  padding: 0.325rem 0.375rem 0.375rem 0.5rem;
`;

class AdminTrackerAgreementIdPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      agreement: null,
      answers: [],
      answersReferences: [],
      isLoading: true,
    };
  }

  async componentDidMount() {
    this.postgrest = customPostgrester();

    const { id: agreementId } = this.props;
    const { data: agreements } = await this.postgrest.eq("id", agreementId).get("/agreements");
    const agreement = agreements[0];

    this.setState({ agreement });

    const { data: answers } = await this.postgrest
      .select("*")
      .select("question(index)")
      .eq("agreement_id", agreementId)
      .orderBy("question.index")
      .get("/answers");

    this.setState({ answers });

    const answerIds = answers.map(({ id }) => id);

    const { data: answersReferences } = await this.postgrest
      .in("answer_id", answerIds)
      .get("/answers_references");

    this.setState({
      answersReferences,
      isLoading: false,
    });
  }

  async fetchAnswersForAgreement(agreementId) {
    const { data: answers } = await this.postgrest.eq("agreement_id", agreementId).get("/answers");

    return answers;
  }

  async findObsoleteAnswersReferences(answersReferences) {
    // TODO Remove `dila_cid !== null` check once all the references are cleaned.
    const localAgreementAnswersReferences = answersReferences.filter(
      ({ category, dila_cid }) =>
        category === C.ANSWER_REFERENCE_CATEGORY.AGREEMENT && dila_cid !== null,
    );

    const obsoleteAgreementAnswersReference = [];
    for (const localAgreementAnswerReference of localAgreementAnswersReferences) {
      try {
        const { dila_id } = localAgreementAnswerReference;
        await dilaApi.get(`/agreement/articles?articleIdsOrCids=${dila_id}`);
      } catch (err) {
        obsoleteAgreementAnswersReference.push(localAgreementAnswerReference);
      }
    }

    return [...obsoleteAgreementAnswersReference];
  }

  open(answerId) {
    window.open(`/admin/answers/${answerId}`, "_blank");
  }

  renderAnswerReferences() {
    const { answers, answersReferences, isLoading } = this.state;

    if (isLoading) {
      return (
        <List alignItems="center" justifyContent="center">
          <LoadingSpinner />
        </List>
      );
    }

    if (answersReferences.length === 0) {
      return (
        <List alignItems="center" justifyContent="center">
          {T.ADMIN_TRACKER_INFO_NO_DATA}
        </List>
      );
    }

    return (
      <List flexDirection="column">
        {answersReferences.map(answerReference => {
          const answer = answers.find(({ id }) => id === answerReference.answer_id);

          return (
            <ListRow alignItems="baseline" justifyContent="space-between" key={answerReference.id}>
              <Idcc code={String(answer.question.index)} name={answer.question.value} />
              <LegalReferenceTag isReadOnly {...answerReference} />
              <OpenButton
                color="secondary"
                icon="external-link-alt"
                onClick={() => this.open(answerReference.answer_id)}
              />
            </ListRow>
          );
        })}
      </List>
    );
  }

  render() {
    const { agreement } = this.state;

    return (
      <AdminMainLayout hasBareContent>
        <Container flexDirection="column" flexGrow="1">
          <Flex alignItems="center" justifyContent="space-between">
            {agreement === null && <Title>Tableau de veille » …</Title>}
            {agreement !== null && (
              <Title>{`Tableau de veille » [${agreement.idcc}] ${shortenAgreementName(
                agreement.name,
              )}`}</Title>
            )}
          </Flex>

          {this.renderAnswerReferences()}
        </Container>
      </AdminMainLayout>
    );
  }
}

export default AdminTrackerAgreementIdPage;
