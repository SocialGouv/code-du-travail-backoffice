import styled from "@emotion/styled";
import debounce from "lodash.debounce";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";

import * as actions from "../../../src/actions";
import Comment from "../../../src/components/Comment";
import LegalReferences from "../../../src/components/LegalReferences";
import Reference from "../../../src/components/Reference";
import {
  ANSWER_STATE,
  ANSWER_STATE_LABEL,
  ANSWER_STATE_OPTIONS,
  LEGAL_REFERENCE_CATEGORY,
} from "../../../src/constants";
import Button from "../../../src/elements/Button";
import _Checkbox from "../../../src/elements/Checkbox";
import Hr from "../../../src/elements/Hr";
import Icon from "../../../src/elements/Icon";
import Idcc from "../../../src/elements/Idcc";
import Input from "../../../src/elements/Input";
import MarkdownEditor from "../../../src/elements/MarkdownEditor";
import Radio from "../../../src/elements/Radio";
import _Select from "../../../src/elements/Select";
import Subtitle from "../../../src/elements/Subtitle";
import Textarea from "../../../src/elements/Textarea";
import Title from "../../../src/elements/Title";
import capitalize from "../../../src/helpers/capitalize";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import customAxios from "../../../src/libs/customAxios";
import makeApiFilter from "../../../src/libs/makeApiFilter";
import T from "../../../src/texts";

const STATES = Object.keys(ANSWER_STATE_LABEL);

const Container = styled(Flex)`
  height: 100%;
`;
const Content = styled(Flex)`
  flex-grow: 1;
  overflow-y: scroll;
  padding: 1rem 1rem 12rem;
`;
const Sidebar = styled(Flex)`
  display: ${({ isHidden }) => (isHidden ? "none" : "flex")};
  padding: 1rem;
  position: relative;
  right: 0;
  min-width: 23rem;
`;

const Question = styled(Title)`
  margin: 0;
  user-select: text;
`;
const StateSelect = styled(_Select)`
  margin-right: 1rem;
`;

const AnswerProposal = styled(MarkdownEditor)`
  border-right: 0 !important;
  min-height: 30rem;

  .editor {
    background-color: rgba(0, 0, 0, 0.025);
    border: 0 !important;
    cursor: text;
  }
  .editor-status {
    display: none;
  }

  .preview {
    background-color: rgba(0, 0, 0, 0.025);
  }
`;
const AnswerCorrection = styled(MarkdownEditor)`
  min-height: 30rem;

  .editor {
    border: 0 !important;
  }
`;
const Strong = styled.p`
  font-weight: 600;
  margin: ${props => (props.isFirst ? "0 0 0.5rem" : "1rem 0 0.5rem")};
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const FormHiddenSubmit = styled.button`
  height: 1px;
  visibility: hidden;
  width: 1px;
`;
const Checkbox = styled(_Checkbox)`
  padding-left: 0;
`;

const Comments = styled(Flex)`
  flex-grow: 1;
  margin-top: 0.5rem;
  max-height: 100%;
  overflow-y: scroll;
`;
const CommentEditor = styled(Textarea)`
  background: ${({ isPrivate }) =>
    !isPrivate
      ? "white"
      : `repeating-linear-gradient(
            45deg,
            #f4f4f4,
            #f4f4f4 10px,
            #ffffff 10px,
            #ffffff 20px
          )`};
  border-radius: 0.25rem;
  font-size: 0.75rem;
  opacity: ${props => (props.disabled ? 0.25 : 1)};
  margin-top: 1rem;
  max-height: 10rem;
  padding: 0.5rem;
  width: 100%;
`;
const CommentEditorIcon = styled(Icon)`
  align-self: flex-end;
  cursor: pointer;
  margin: 0.25rem 0 1rem;
  opacity: 0.25;

  :hover {
    opacity: 0.5;
  }
`;

export class AdminAnwsersEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      agreementReferenceValueInputKey: 0,
      isSidebarHidden: true,
      isUpdating: false,
      otherReferenceUrlInputKey: 0,
      otherReferenceValueInputKey: 2,
      prevalue: null,
      value: "",
    };

    this.isGeneric = Boolean(props.isGeneric);
    this.updateAnswerValue = debounce(this._updateAnswerValue.bind(this), 500);
    this.loadLegalReferences = debounce(this._loadLegalReferences.bind(this), 250);
  }

  componentDidMount() {
    this.axios = customAxios();

    this.load();
  }

  componentDidUpdate() {
    if (!this.props.answers.isLoading) {
      if (this.state.prevalue === null || this.state.value === null) {
        const { prevalue, value } = this.props.answers.data;

        this.setState({
          prevalue,
          value,
        });
      }
    }

    // if (!this.props.answers.isLoading && !this.props.comments.isLoading) {
    //   this.$commentsContainer.scrollTo(0, this.$commentsContainer.scrollHeight);
    // }
  }

  load() {
    const { dispatch, id: answerId } = this.props;

    dispatch(actions.answers.loadOne(answerId));
    dispatch(actions.comments.load(answerId));
  }

  async _updateAnswerValue({ source }) {
    try {
      this.setState({ isUpdating: true });

      const value = source.trim();
      const { state } = this.props.answers.data;
      const uri = `/answers?id=eq.${this.props.id}`;
      const data = { value };

      // An answer can't have a "to do" state with a non-empty value:
      if (state === ANSWER_STATE.TO_DO && value.length > 0) {
        data.state = ANSWER_STATE.UNDER_REVIEW;
      }

      await this.axios.patch(uri, data);
    } catch (err) {
      console.warn(err);
    }

    this.setState({ isUpdating: false });
  }

  updateAnswerState({ value }) {
    const { id } = this.props;

    this.props.dispatch(actions.answers.updateState([id], value, () => window.location.reload()));
  }

  updateGenericReference(generic_reference) {
    const { dispatch, id } = this.props;

    dispatch(actions.answers.updateGenericReference([id], generic_reference, this.load.bind(this)));
  }

  async createReference(reference) {
    this.setState({ isUpdating: true });

    try {
      const { state } = this.props.answers.data;
      const answersUri = `/answers?id=eq.${this.props.id}`;

      // An answer can't have a reference and be generic at the same time:
      const answersData = {
        generic_reference: null,
      };

      // An answer can't have a "to do" state with a reference:
      if (state === ANSWER_STATE.TO_DO) {
        answersData.state = ANSWER_STATE.UNDER_REVIEW;
      }

      const answersReferencesUri = `/answers_references`;
      const answersReferencesData = {
        answer_id: this.props.id,
        ...reference,
      };

      await this.axios.patch(answersUri, answersData);
      await this.axios.post(answersReferencesUri, answersReferencesData);
    } catch (err) {
      console.warn(err);
    }

    await this.load();
  }

  async deleteReference(id) {
    this.setState({ isUpdating: true });

    try {
      const uri = makeApiFilter("/answers_references", { id });

      await this.axios.delete(uri);
    } catch (err) {
      console.warn(err);
    }

    await this.load();
  }

  submitReference(event, category = null) {
    event.preventDefault();
    this.setState({ isUpdating: true });

    let reference;
    if (category === "agreement") {
      reference = {
        category,
        value: this.$agreementReferenceValueInput.value.trim(),
      };

      this.setState({
        agreementReferenceValueInputKey: this.state.agreementReferenceValueInputKey + 1,
      });
    } else {
      const url = this.$otherReferenceUrlInput.value.trim();
      reference = {
        category,
        url: url.length !== 0 ? url : null,
        value: this.$otherReferenceValueInput.value.trim(),
      };

      this.setState({
        otherReferenceUrlInputKey: this.state.otherReferenceUrlInputKey + 1,
        otherReferenceValueInputKey: this.state.otherReferenceValueInputKey + 1,
      });
    }

    this.createReference(reference);
  }

  showSavingSpinner() {
    if (this.state.isUpdating) {
      clearTimeout(this.state.savingSpinnerTimeout);
    }

    this.setState({
      isUpdating: true,
      savingSpinnerTimeout: setTimeout(
        () =>
          this.setState({
            isUpdating: false,
            savingSpinnerTimeout: 0,
          }),
        500,
      ),
    });
  }

  toggleSidebar() {
    this.setState({ isSidebarHidden: !this.state.isSidebarHidden });
  }

  toggleIsPublished() {
    const { id, is_published } = this.props.answers.data;

    this.props.dispatch(
      actions.answers.updateIsPublished([id], !is_published, this.load.bind(this)),
    );
  }

  handleCommentField(event) {
    if (event.key !== "Enter") return;

    if (event.shiftKey) {
      event.preventDefault();
      this.props.dispatch(actions.comments.toggleOnePrivacy());

      return;
    }

    const value = this.$commentTextarea.value.trim();
    if (value.length === 0) return;

    if (event.ctrlKey) {
      this.props.dispatch(
        actions.comments.addOne(value, this.props.comments.currentIsPrivate, this.props.id),
      );
    }
  }

  removeComment(id) {
    this.props.dispatch(actions.comments._delete([id], this.props.id));
  }

  _loadLegalReferences(category, query) {
    const {
      answers,
      legalReferences: { isLoading },
    } = this.props;
    if (isLoading) return;

    if (category === LEGAL_REFERENCE_CATEGORY.AGREEMENT) {
      const { agreement } = answers.data;

      this.props.dispatch(actions.legalReferences.load(category, query, agreement.idcc));

      return;
    }

    this.props.dispatch(actions.legalReferences.load(category, query));
  }

  addReference(category, { id: dilaId }) {
    const { id: answerId } = this.props;
    const reference = {
      answer_id: answerId,
      category,
      dila_id: dilaId,
      value: dilaId,
    };

    this.props.dispatch(actions.answers.addReferences([reference], this.load.bind(this)));
  }

  updateReference(data) {
    this.props.dispatch(actions.answers.updateReferences([data], this.load.bind(this)));
  }

  removeReference(answerReferenceId) {
    this.props.dispatch(
      actions.answers.removeReferences([answerReferenceId], this.load.bind(this)),
    );
  }

  renderReferences(category, isDisabled) {
    const { answers } = this.props;
    const { references, state } = answers.data;

    const filteredReferences = references.filter(
      ({ category: _category }) => _category === category,
    );

    if (state === ANSWER_STATE.VALIDATED && filteredReferences.length === 0) {
      return;
    }

    return filteredReferences.map(({ id, url, value }, index) => (
      <Reference
        isDisabled={isDisabled}
        key={index}
        onRemove={() => this.deleteReference(id)}
        url={url}
        value={value}
      />
    ));
  }

  renderComments() {
    return this.props.comments.data.map(({ id, is_private, value }, index) => (
      <Comment
        isMe={true}
        isPrivate={is_private}
        key={index}
        onRemove={() => this.removeComment(id)}
        value={value}
      />
    ));
  }

  render() {
    const { answers, comments, legalReferences } = this.props;
    const { prevalue, isSidebarHidden, value } = this.state;

    const isLoading =
      answers.isLoading || comments.isLoading || prevalue === null || value === null;

    if (isLoading) {
      return <AdminMainLayout isLoading />;
    }

    const {
      agreement,
      generic_reference,
      is_published,
      question,
      references,
      state,
    } = answers.data;
    const stateSelectValue = ANSWER_STATE_OPTIONS.find(({ value }) => value === state);

    const laborCodeReferences = references.filter(
      ({ category }) => category === LEGAL_REFERENCE_CATEGORY.LABOR_CODE,
    );
    const agreementReferences = references.filter(
      ({ category }) => category === LEGAL_REFERENCE_CATEGORY.AGREEMENT,
    );
    const $otherReferences = this.renderReferences(null, true);

    return (
      <AdminMainLayout isScrollable={false}>
        <Container>
          <Content flexDirection="column">
            <Flex alignItems="baseline" justifyContent="space-between">
              <Flex alignItems="baseline">
                {this.isGeneric ? <Idcc /> : <Idcc code={agreement.idcc} name={agreement.name} />}
                <Question>{`${question.index}) ${question.value}`}</Question>
              </Flex>

              <Flex alignItems="center">
                {isSidebarHidden && (
                  <StateSelect
                    isDisabled={isLoading}
                    onChange={this.updateAnswerState.bind(this)}
                    options={ANSWER_STATE_OPTIONS}
                    value={stateSelectValue}
                  >
                    {STATES.map(state => (
                      <option key={state} value={state}>
                        {capitalize(ANSWER_STATE_LABEL[state])}
                      </option>
                    ))}
                  </StateSelect>
                )}

                <Button color="info" icon="comments" onClick={this.toggleSidebar.bind(this)}>
                  {comments.data.length}
                </Button>
              </Flex>
            </Flex>
            <Hr />

            {state !== ANSWER_STATE.VALIDATED && (
              <Flex flexDirection="column" width={1}>
                <Flex>
                  <Flex flexDirection="column" style={{ minHeight: "19rem" }} width={1}>
                    <Subtitle isFirst>Réponse proposée</Subtitle>
                    <AnswerProposal
                      defaultValue={prevalue}
                      disabled
                      headersOffset={2}
                      isSingleView
                    />
                  </Flex>

                  <Flex flexDirection="column" style={{ minHeight: "19rem" }} width={1}>
                    <Subtitle isFirst>
                      {this.isGeneric ? "Réponse générique" : "Réponse corrigée"}
                    </Subtitle>
                    <AnswerCorrection
                      defaultValue={value}
                      headersOffset={2}
                      isSingleView
                      onChange={this.updateAnswerValue.bind(this)}
                      singleViewDefault="editor"
                    />
                  </Flex>
                </Flex>
                <Hr />

                <Subtitle isFirst>Références juridiques</Subtitle>
                <Flex flexDirection="column">
                  <Strong isFirst>Code du travail :</Strong>
                  <LegalReferences
                    category={LEGAL_REFERENCE_CATEGORY.LABOR_CODE}
                    data={
                      legalReferences.category === LEGAL_REFERENCE_CATEGORY.LABOR_CODE
                        ? legalReferences.data
                        : []
                    }
                    onAdd={data => this.addReference(LEGAL_REFERENCE_CATEGORY.LABOR_CODE, data)}
                    onInput={query =>
                      this.loadLegalReferences(LEGAL_REFERENCE_CATEGORY.LABOR_CODE, query)
                    }
                    onRemove={this.removeReference.bind(this)}
                    references={laborCodeReferences}
                  />
                </Flex>
                <Flex flexDirection="column">
                  <Strong>Convention collective :</Strong>
                  <LegalReferences
                    category={LEGAL_REFERENCE_CATEGORY.AGREEMENT}
                    data={
                      legalReferences.category === LEGAL_REFERENCE_CATEGORY.AGREEMENT
                        ? legalReferences.data
                        : []
                    }
                    isEditable
                    onAdd={data => this.addReference(LEGAL_REFERENCE_CATEGORY.AGREEMENT, data)}
                    onChange={this.updateReference.bind(this)}
                    onInput={query =>
                      this.loadLegalReferences(LEGAL_REFERENCE_CATEGORY.AGREEMENT, query)
                    }
                    onRemove={this.removeReference.bind(this)}
                    references={agreementReferences}
                  />
                </Flex>
                <Form onSubmit={this.submitReference.bind(this)}>
                  <Strong>Autres :</Strong>
                  <Input
                    disabled={this.state.isUpdating}
                    key={this.state.otherReferenceValueInputKey}
                    placeholder="Référence (ex: Décret n°82-447 du 28 mai 1982…)"
                    ref={node => (this.$otherReferenceValueInput = node)}
                  />
                  <Input
                    disabled={this.state.isUpdating}
                    key={this.state.otherReferenceUrlInputKey}
                    placeholder="URL (ex: https://www.legifrance.gouv.fr/…)"
                    ref={node => (this.$otherReferenceUrlInput = node)}
                    style={{ marginTop: "0.5rem" }}
                  />
                  <Flex flexWrap="wrap">{$otherReferences}</Flex>
                  <FormHiddenSubmit type="submit" />
                </Form>
                <Hr />

                <Subtitle isFirst>Renvoi</Subtitle>
                <Radio
                  disabled={state === ANSWER_STATE.VALIDATED}
                  onChange={this.updateGenericReference.bind(this)}
                  options={[
                    {
                      isSelected: generic_reference === null,
                      label: "Aucun renvoi.",
                      value: null,
                    },
                    {
                      isSelected: generic_reference === "labor_code",
                      label: "Renvoyée au texte Code du Travail.",
                      value: "labor_code",
                    },
                    {
                      isSelected: generic_reference === "national_agreement",
                      label: "Renvoyée au texte de la CCN.",
                      value: "national_agreement",
                    },
                  ]}
                />
              </Flex>
            )}

            {state === ANSWER_STATE.VALIDATED && (
              <Flex flexDirection="column" width={1}>
                <Subtitle isFirst>Réponse validée</Subtitle>
                <AnswerCorrection defaultValue={value} disabled headersOffset={2} isSingleView />

                <Subtitle>Références juridiques</Subtitle>
                {laborCodeReferences.length !== 0 && (
                  <>
                    <Strong isFirst>Code du travail</Strong>
                    <LegalReferences
                      category={LEGAL_REFERENCE_CATEGORY.LABOR_CODE}
                      isReadOnly
                      references={laborCodeReferences}
                    />
                  </>
                )}
                {agreementReferences.length !== 0 && (
                  <>
                    <Strong isFirst>Convention collective</Strong>
                    <LegalReferences
                      category={LEGAL_REFERENCE_CATEGORY.AGREEMENT}
                      isReadOnly
                      references={agreementReferences}
                    />
                  </>
                )}
                {$otherReferences !== undefined && (
                  <>
                    <Strong isFirst>Autres</Strong>
                    {$otherReferences}
                  </>
                )}
                <Hr />

                <Subtitle isFirst>Renvoi</Subtitle>
                {
                  {
                    labor_code: "Renvoyée au texte Code du Travail.",
                    national_agreement: "Renvoyée au texte de la CCN.",
                    null: "Aucun renvoi.",
                  }[String(generic_reference)]
                }
                <Hr />

                <Subtitle isFirst>Publication</Subtitle>
                <Flex>
                  <Checkbox isChecked={is_published} onClick={this.toggleIsPublished.bind(this)} />
                  Publiée sur le site du code du travail numérique.
                </Flex>
              </Flex>
            )}

            <Hr />
          </Content>
          <Sidebar flexDirection="column" isHidden={isSidebarHidden} justifyContent="space-between">
            <Subtitle isFirst>Commentaires et validation</Subtitle>
            <Comments flexDirection="column" ref={node => (this.$commentsContainer = node)}>
              {this.renderComments()}
            </Comments>
            <CommentEditor
              disabled={comments.currentIsLoading}
              isPrivate={comments.currentIsPrivate}
              key={comments.currentKey}
              onKeyPress={this.handleCommentField.bind(this)}
              placeholder={T.ADMIN_ANSWERS_COMMENT_PLACEHOLDER}
              ref={node => (this.$commentTextarea = node)}
              rows={10}
            />
            <CommentEditorIcon
              icon={comments.currentIsPrivate ? "lock" : "unlock"}
              onClick={() => this.props.dispatch(actions.comments.toggleOnePrivacy())}
            />
          </Sidebar>
        </Container>
      </AdminMainLayout>
    );
  }
}

export default connect(({ answers, comments, legalReferences }) => ({
  answers,
  comments,
  legalReferences,
}))(AdminAnwsersEditPage);
