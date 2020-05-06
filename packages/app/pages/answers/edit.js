import styled from "@emotion/styled";
import debounce from "lodash.debounce";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";

import * as actions from "../../src/actions";
import AnswerEditionContentBlock from "../../src/blocks/AnswerEditionContent";
import AnswerEditionHeadBlock from "../../src/blocks/AnswerEditionHead";
import { TABS } from "../../src/blocks/AnswerEditionHead/Tabs";
import AnswerEditionReferencesBlock from "../../src/blocks/AnswerEditionReferences";
import { ANSWER_STATE } from "../../src/constants";
import SavingSpinner from "../../src/elements/SavingSpinner";
import Main from "../../src/layouts/Main";
import api from "../../src/libs/api";
import getCurrentUser from "../../src/libs/getCurrentUser";
import makeApiFilter from "../../src/libs/makeApiFilter";

const Container = styled(Main)`
  overflow-x: hidden;
`;
const Content = styled(Flex)`
  flex-grow: 1;
  overflow-y: auto;
`;
const ContentInfo = styled(Flex)`
  color: var(--color-shadow);
  font-size: 1rem;
  margin-top: 0.5rem;
  position: absolute;
  right: 1rem;
  width: 12.5rem;
`;

class AnswersEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: TABS.EDITOR,
      hasSavingSpinner: false,
      isLoading: true,
      isSaving: false,
      me: null,
      references: [],
      savingSpinnerTimeout: 0,
    };

    this.prevalue = null;
    this.newPrevalue = null;

    this.createReference = debounce(this._createReference.bind(this), 500);
    this.deleteReference = debounce(this._deleteReference.bind(this), 500);
    this.updatePrevalue = debounce(this._updatePrevalue.bind(this), 500);
  }

  async componentDidMount() {
    const { id } = this.props;
    const me = getCurrentUser();

    this.load();

    try {
      const references = await api.get(`/answers_references?answer_id=eq.${id}`);

      this.setState({
        isLoading: false,
        me,
        references,
      });
    } catch (err) {
      console.warn(err);
    }
  }

  componentDidUpdate() {
    if (!this.props.answers.isLoading) {
      if (this.prevalue === null) {
        this.prevalue = this.props.answers.data.prevalue;
        this.newPrevalue = this.props.answers.data.prevalue;
        this.forceUpdate();
      }
    }
  }

  load() {
    const { dispatch, id } = this.props;

    dispatch(actions.answers.loadOne(id));
  }

  async cancel() {
    if (this.state.isSaving) return;

    this.props.dispatch(
      actions.modal.open(
        `Êtes-vous sûr d'annuler cette réponse (son contenu sera supprimé) ?`,
        () => actions.answers.cancel([this.props.id], () => Router.push("/answers/draft/1")),
      ),
    );
  }

  async requestForAnswerValidation() {
    if (this.state.isSaving) return;

    this.props.dispatch(
      actions.modal.open(`Êtes-vous sûr d'envoyer cette réponse en validation ?`, () =>
        actions.answers.updateState([this.props.id], ANSWER_STATE.PENDING_REVIEW, () =>
          Router.push("/answers/draft/1"),
        ),
      ),
    );
  }

  async _updatePrevalue(value) {
    this.setState({ isSaving: true });
    this.showSavingSpinner();

    try {
      const uri = `/answers?id=eq.${this.props.id}`;
      const data = {
        prevalue: value,
        state: "draft",
        user_id: this.state.me.id,
      };

      await api.patch(uri, data);
      this.newPrevalue = value;
    } catch (err) {
      console.warn(err);
    }

    this.setState({ isSaving: false });
  }

  async _createReference(reference) {
    this.setState({ isSaving: true });

    try {
      const answersUri = `/answers?id=eq.${this.props.id}`;
      const answersData = {
        state: "draft",
        user_id: this.state.me.id,
      };
      const answersReferencesUri = `/answers_references`;
      const answersReferencesData = {
        answer_id: this.props.id,
        ...reference,
      };

      await api.patch(answersUri, answersData);
      await api.post(answersReferencesUri, answersReferencesData);
    } catch (err) {
      console.warn(err);
    }

    this.setState({
      isSaving: false,
      references: [...this.state.references, reference],
    });
  }

  async _deleteReference(_value) {
    this.setState({ isSaving: true });

    try {
      const uri = makeApiFilter("/answers_references", {
        answer_id: this.props.id,
        value: _value,
      });

      await api.delete(uri);
    } catch (err) {
      console.warn(err);
    }

    this.setState({
      isSaving: false,
      references: this.state.references.filter(({ value }) => value !== _value),
    });
  }

  showSavingSpinner() {
    if (this.state.hasSavingSpinner) {
      clearTimeout(this.state.savingSpinnerTimeout);
    }

    this.setState({
      hasSavingSpinner: true,
      savingSpinnerTimeout: setTimeout(
        () =>
          this.setState({
            hasSavingSpinner: false,
            savingSpinnerTimeout: 0,
          }),
        2000,
      ),
    });
  }

  switchTab(nextTab) {
    if (nextTab === this.state.currentTab) return;

    if (nextTab === TABS.EDITOR) {
      this.prevalue = this.newPrevalue;
    }

    this.setState({ currentTab: nextTab });
  }

  renderTab() {
    const { prevalue } = this;
    const { references } = this.state;

    switch (this.state.currentTab) {
      case TABS.REFERENCES:
        return (
          <AnswerEditionReferencesBlock
            onAdd={this.createReference.bind(this)}
            onRemove={this.deleteReference.bind(this)}
            references={references}
          />
        );

      case TABS.EDITOR:
      default:
        return <AnswerEditionContentBlock defaultValue={prevalue} onChange={this.updatePrevalue} />;
    }
  }

  render() {
    const { prevalue } = this;
    const { answers } = this.props;
    const { isLoading, references } = this.state;

    if (isLoading || answers.isLoading || prevalue === null) {
      return <Main isLoading />;
    }

    const { agreement, question } = answers.data;

    return (
      <Container>
        <AnswerEditionHeadBlock
          agreement={agreement}
          currentTab={this.state.currentTab}
          idcc={agreement.idcc}
          index={agreement.index}
          onCancel={() => this.cancel()}
          onSubmit={() => this.requestForAnswerValidation()}
          onTabChange={this.switchTab.bind(this)}
          question={question}
          referencesCount={references.length}
        />
        <Content>
          {this.state.hasSavingSpinner && (
            <ContentInfo alignItems="center" justifyContent="space-between">
              <SavingSpinner color="var(--color-shadow)" size={26} />
              Sauvegarde en cours…
            </ContentInfo>
          )}

          {this.renderTab()}
        </Content>
      </Container>
    );
  }
}

export default connect(({ answers }) => ({ answers }))(AnswersEditPage);
