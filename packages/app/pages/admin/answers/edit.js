import styled from "@emotion/styled";
import debounce from "lodash.debounce";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";

import * as actions from "../../../src/actions";
import Comment from "../../../src/components/Comment";
import LegalReferences from "../../../src/components/LegalReferences";
import * as C from "../../../src/constants";
import Button from "../../../src/elements/Button";
import Checkbox from "../../../src/elements/Checkbox";
import Hr from "../../../src/elements/Hr";
import Icon from "../../../src/elements/Icon";
import Idcc from "../../../src/elements/Idcc";
import Input from "../../../src/elements/Input";
import LoadingSpinner from "../../../src/elements/LoadingSpinner";
import MarkdownEditor from "../../../src/elements/MarkdownEditor";
import Radio from "../../../src/elements/Radio";
import Select from "../../../src/elements/Select";
import Subtitle from "../../../src/elements/Subtitle";
import Textarea from "../../../src/elements/Textarea";
import AdminMainLayout from "../../../src/layouts/AdminMain";
import api from "../../../src/libs/api";
import makeApiFilter from "../../../src/libs/makeApiFilter";
import T from "../../../src/texts";

const Container = styled(Flex)`
  height: 100%;
`;
const Content = styled(Flex)`
  flex-grow: 1;
  overflow-y: scroll;
  padding: 1rem;
`;
const Sidebar = styled(Flex)`
  display: ${({ isHidden }) => (isHidden ? "none" : "flex")};
  padding: 1rem;
  position: relative;
  right: 0;
  min-width: 23rem;
`;

const Question = styled(Subtitle)`
  margin: 0;
  user-select: text;
`;

const Loaditor = styled(Flex)`
  min-height: 30rem;
`;
const Preditor = styled(MarkdownEditor)`
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
const Editor = styled(MarkdownEditor)`
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

const Comments = styled(Flex)`
  flex-grow: 1;
  margin-top: 0.5rem;
  max-height: 100%;
  overflow-y: auto;
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
  margin-top: 0.25rem;
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
      isFirstLoad: true,
      isSidebarHidden: true,
      otherReferenceUrlInputKey: 0,
      otherReferenceValueInputKey: 2,
      selectedAgreementIdcc: null,
    };

    this.isGeneric = Boolean(props.isGeneric);
    this.originalPrevalue = "";
    this.originalValue = "";

    this.updateAnswerValue = debounce(this._updateAnswerValue.bind(this), 500);
    this.loadLegalReferences = debounce(this.loadLegalReferences.bind(this), 250);
  }

  componentDidMount() {
    const { dispatch, id: answerId } = this.props;

    dispatch(actions.answers.loadOne(answerId));
    dispatch(actions.comments.load(answerId));
  }

  componentDidUpdate() {
    const { answers, comments } = this.props;
    const { isFirstLoad } = this.state;

    if (isFirstLoad && !answers.isLoading) {
      const { prevalue, value } = answers.data;
      this.originalPrevalue = prevalue;
      this.originalValue = value;

      this.setState({
        isFirstLoad: false,
        selectedAgreementIdcc: answers.data.agreement.idcc,
      });
    }

    if (!answers.isLoading && !comments.isLoading) {
      this.$commentsContainer.scrollTo(0, this.$commentsContainer.scrollHeight);
    }
  }

  load() {
    const { dispatch, id: answerId } = this.props;

    dispatch(actions.answers.loadOne(answerId));
    dispatch(actions.comments.load(answerId));
  }

  getReferences(category) {
    const { answers } = this.props;

    if (answers.isLoading) {
      return [];
    }

    return answers.data.references.filter(reference => reference.category === category);
  }

  async _updateAnswerValue({ source }) {
    try {
      const value = source.trim();
      const { state } = this.props.answers.data;
      const uri = `/answers?id=eq.${this.props.id}`;
      const data = { value };

      // An answer can't have a "to do" state with a non-empty value:
      if (state === C.ANSWER_STATE.TO_DO && value.length > 0) {
        data.state = C.ANSWER_STATE.UNDER_REVIEW;
      }

      await api.patch(uri, data);
    } catch (err) {
      console.warn(err);
    }
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
    try {
      const { state } = this.props.answers.data;
      const answersUri = `/answers?id=eq.${this.props.id}`;

      // An answer can't have a reference and be generic at the same time:
      const answersData = {
        generic_reference: null,
      };

      // An answer can't have a "to do" state with a reference:
      if (state === C.ANSWER_STATE.TO_DO) {
        answersData.state = C.ANSWER_STATE.UNDER_REVIEW;
      }

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

    await this.load();
  }

  async deleteReference(id) {
    try {
      const uri = makeApiFilter("/answers_references", { id });

      await api.delete(uri);
    } catch (err) {
      console.warn(err);
    }

    await this.load();
  }

  submitReference(event, category = null) {
    event.preventDefault();

    let reference;
    if (category === "agreement") {
      reference = {
        category,
        value: this.$agreementReferenceValueInput.value.trim(),
      };
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
    if (event.which !== 13) return;

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

  loadLegalReferences(category, query) {
    const { dispatch, legalReferences } = this.props;
    const { selectedAgreementIdcc } = this.state;
    if (legalReferences.isLoading) return;

    if (category === C.LEGAL_REFERENCE_CATEGORY.AGREEMENT) {
      dispatch(actions.legalReferences.load(category, query, selectedAgreementIdcc));

      return;
    }

    dispatch(actions.legalReferences.load(category, query));
  }

  async addReference(category, legalReference) {
    const { dispatch, id: answer_id } = this.props;

    const answerReference = {
      answer_id,
      category,
      dila_cid: legalReference.cid,
      dila_container_id: legalReference.containerId,
      dila_id: legalReference.id,
      value: legalReference.name,
    };

    dispatch(actions.answers.addReferences([answerReference], this.load.bind(this)));
  }

  updateReference(data) {
    const { dispatch } = this.props;

    dispatch(actions.answers.updateReferences([data], this.load.bind(this)));
  }

  removeReference(answerReferenceId) {
    const { dispatch } = this.props;

    dispatch(actions.answers.removeReferences([answerReferenceId], this.load.bind(this)));
  }

  renderTop() {
    const { answers, comments } = this.props;
    const { isFirstLoad } = this.state;

    const stateActionDefaultValue = !isFirstLoad
      ? C.ANSWER_STATE_OPTIONS.find(({ value }) => value === answers.data.state)
      : undefined;

    return (
      <Flex justifyContent="space-between">
        <Select
          instanceId="stateAction"
          isDisabled={answers.isLoading}
          isLoading={isFirstLoad}
          onChange={this.updateAnswerState.bind(this)}
          options={C.ANSWER_STATE_OPTIONS}
          value={stateActionDefaultValue}
          withMarginRight
        />

        <Button
          color="info"
          icon="comments"
          isDisabled={answers.isLoading}
          onClick={this.toggleSidebar.bind(this)}
        >
          {!comments.isLoading ? comments.list.length : "…"}
        </Button>
      </Flex>
    );
  }

  renderHead() {
    const { answers } = this.props;

    if (answers.isLoading) {
      return (
        <Flex alignItems="baseline">
          <Idcc code="…" name="…" />
          <Question>…</Question>
        </Flex>
      );
    }

    const { agreement, question } = answers.data;
    const { idcc, name } = agreement !== null ? agreement : { idcc: null, name: null };

    return (
      <Flex alignItems="baseline">
        <Idcc code={idcc} name={name} />
        <Question>{`${question.index}) ${question.value}`}</Question>
      </Flex>
    );
  }

  renderEditor() {
    const { answers } = this.props;
    const { isFirstLoad } = this.state;

    if (isFirstLoad) {
      return (
        <Flex flexDirection="column" width={1}>
          <Subtitle isFirst>…</Subtitle>
          <Loaditor alignItems="center" justifyContent="center">
            <LoadingSpinner />
          </Loaditor>
        </Flex>
      );
    }

    if (answers.data.state === C.ANSWER_STATE.VALIDATED) {
      return (
        <Flex flexDirection="column" width={1}>
          <Subtitle isFirst>Réponse validée</Subtitle>
          <Editor defaultValue={this.originalValue} disabled headersOffset={2} isSingleView />
        </Flex>
      );
    }

    return (
      <Flex>
        <Flex flexDirection="column" width={0.5}>
          <Subtitle isFirst>Réponse proposée</Subtitle>
          <Preditor defaultValue={this.originalPrevalue} disabled headersOffset={2} isSingleView />
        </Flex>

        <Flex flexDirection="column" width={0.5}>
          <Subtitle isFirst>{this.isGeneric ? "Réponse générique" : "Réponse corrigée"}</Subtitle>
          <Editor
            defaultValue={this.originalValue}
            headersOffset={2}
            isSingleView
            onChange={this.updateAnswerValue.bind(this)}
            singleViewDefault="editor"
          />
        </Flex>
      </Flex>
    );
  }

  renderReferences() {
    const { answers, legalReferences } = this.props;
    const { selectedAgreementIdcc } = this.state;
    const isReadOnly = answers.isLoading || answers.data.state === C.ANSWER_STATE.VALIDATED;

    return (
      <div>
        <Subtitle isFirst>Références juridiques</Subtitle>
        {!this.isGeneric && (
          <Flex flexDirection="column">
            <Strong isFirst>Convention collective :</Strong>
            <LegalReferences
              category={C.LEGAL_REFERENCE_CATEGORY.AGREEMENT}
              data={
                legalReferences.category === C.LEGAL_REFERENCE_CATEGORY.AGREEMENT
                  ? legalReferences.list
                  : []
              }
              idcc={selectedAgreementIdcc}
              isLoading={answers.isLoading}
              isReadOnly={isReadOnly}
              onAdd={data => this.addReference(C.LEGAL_REFERENCE_CATEGORY.AGREEMENT, data)}
              onChange={this.updateReference.bind(this)}
              onIdccChange={selectedAgreementIdcc => this.setState({ selectedAgreementIdcc })}
              onInput={query =>
                this.loadLegalReferences(C.LEGAL_REFERENCE_CATEGORY.AGREEMENT, query)
              }
              onRemove={this.removeReference.bind(this)}
              references={this.getReferences(C.LEGAL_REFERENCE_CATEGORY.AGREEMENT)}
            />
          </Flex>
        )}
        <Flex flexDirection="column">
          <Strong isFirst={this.isGeneric}>Code du travail :</Strong>
          <LegalReferences
            category={C.LEGAL_REFERENCE_CATEGORY.LABOR_CODE}
            data={
              legalReferences.category === C.LEGAL_REFERENCE_CATEGORY.LABOR_CODE
                ? legalReferences.list
                : []
            }
            isLoading={answers.isLoading}
            isReadOnly={isReadOnly}
            onAdd={data => this.addReference(C.LEGAL_REFERENCE_CATEGORY.LABOR_CODE, data)}
            onInput={query =>
              this.loadLegalReferences(C.LEGAL_REFERENCE_CATEGORY.LABOR_CODE, query)
            }
            onRemove={this.removeReference.bind(this)}
            references={this.getReferences(C.LEGAL_REFERENCE_CATEGORY.LABOR_CODE)}
          />
        </Flex>
        <Flex flexDirection="column">
          <Strong>Autres :</Strong>
          {!isReadOnly && (
            <Form onSubmit={this.submitReference.bind(this)}>
              <Input
                key={this.state.otherReferenceValueInputKey}
                placeholder="Référence (ex: Décret n°82-447 du 28 mai 1982…)"
                ref={node => (this.$otherReferenceValueInput = node)}
              />
              <Input
                key={this.state.otherReferenceUrlInputKey}
                placeholder="URL (ex: https://www.legifrance.gouv.fr/…)"
                ref={node => (this.$otherReferenceUrlInput = node)}
                style={{ marginTop: "0.5rem" }}
              />
              <FormHiddenSubmit type="submit" />
            </Form>
          )}
          <LegalReferences
            category={null}
            isLoading={answers.isLoading}
            isReadOnly={isReadOnly}
            onAdd={data => this.addReference(null, data)}
            onChange={this.updateReference.bind(this)}
            onRemove={this.removeReference.bind(this)}
            references={this.getReferences(null)}
          />
        </Flex>
      </div>
    );
  }

  renderGenericReference() {
    const { answers } = this.props;
    const { isFirstLoad } = this.state;

    if (isFirstLoad) {
      return null;
    }

    const { data, isLoading } = answers;
    const { state, generic_reference } = data;

    if (state === C.ANSWER_STATE.VALIDATED && generic_reference === null) {
      return null;
    }

    return (
      <div>
        <Hr />
        <Subtitle isFirst>Renvoi</Subtitle>
        {state !== C.ANSWER_STATE.VALIDATED && (
          <Radio
            disabled={isLoading}
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
        )}
      </div>
    );
  }

  renderPublication() {
    const { answers } = this.props;
    const { isFirstLoad } = this.state;

    if (isFirstLoad || answers.data.state !== C.ANSWER_STATE.VALIDATED) {
      return null;
    }

    return (
      <div>
        <Hr />
        <Subtitle isFirst>Publication</Subtitle>
        <Flex>
          <Checkbox
            isChecked={answers.data.is_published}
            onClick={this.toggleIsPublished.bind(this)}
            withMarginRight
          />
          Publiée sur le site du code du travail numérique.
        </Flex>
      </div>
    );
  }

  renderSidebar() {
    const { comments } = this.props;

    const { isSidebarHidden } = this.state;

    return (
      <Sidebar flexDirection="column" isHidden={isSidebarHidden} justifyContent="space-between">
        <Subtitle isFirst>Commentaires</Subtitle>
        <Comments flexDirection="column" ref={node => (this.$commentsContainer = node)}>
          {this.renderComments()}
        </Comments>
        <Flex alignContent="flex-end" flexDirection="column">
          <CommentEditor
            disabled={comments.currentIsLoading}
            isPrivate={comments.currentIsPrivate}
            key={comments.currentKey}
            onKeyPressCapture={this.handleCommentField.bind(this)}
            placeholder={T.ADMIN_ANSWERS_COMMENT_PLACEHOLDER}
            ref={node => (this.$commentTextarea = node)}
            rows={10}
          />
          <CommentEditorIcon
            icon={comments.currentIsPrivate ? "lock" : "unlock"}
            onClick={() => this.props.dispatch(actions.comments.toggleOnePrivacy())}
          />
        </Flex>
      </Sidebar>
    );
  }

  renderComments() {
    const { comments } = this.props;

    return comments.list.map(({ id, is_private, value }, index) => (
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
    return (
      <AdminMainLayout noScroll>
        <Container>
          <Content flexDirection="column">
            {this.renderTop()}
            <Hr />
            {this.renderHead()}
            <Hr />

            {this.renderEditor()}
            <Hr />

            {this.renderReferences()}

            {this.renderGenericReference()}
            {this.renderPublication()}
          </Content>

          {this.renderSidebar()}
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
