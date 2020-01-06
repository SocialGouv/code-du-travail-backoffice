import debounce from "lodash.debounce";
import React from "react";
import Medixtor from "react-medixtor";
import { connect } from "react-redux";
import { Flex } from "rebass";
import styled from "@emotion/styled";

import * as actions from "../../../src/actions";
import Comment from "../../../src/components/Comment";
import LawReferences from "../../../src/components/LawReferences";
import Reference from "../../../src/components/Reference";
import AdminMain from "../../../src/layouts/AdminMain";
import Button from "../../../src/elements/Button";
import _Checkbox from "../../../src/elements/Checkbox";
import Hr from "../../../src/elements/Hr";
import Icon from "../../../src/elements/Icon";
import Idcc from "../../../src/elements/Idcc";
import Input from "../../../src/elements/Input";
import Radio from "../../../src/elements/Radio";
import _Select from "../../../src/elements/Select";
import Subtitle from "../../../src/elements/Subtitle";
import Textarea from "../../../src/elements/Textarea";
import Title from "../../../src/elements/Title";
import capitalize from "../../../src/helpers/capitalize";
import customAxios from "../../../src/libs/customAxios";
import makeApiFilter from "../../../src/libs/makeApiFilter";

import { ANSWER_STATE, ANSWER_STATE_LABEL, ANSWER_STATE_OPTIONS } from "../../../src/constants";
import T from "../../../src/texts";

const STATES = Object.keys(ANSWER_STATE_LABEL);

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

const StateSelect = styled(_Select)`
  margin-right: 1rem;
`;

const aIconUri = [
  "https://codedutravail-dev.num.social.gouv.fr",
  "/static/assets/icons/external-link.svg"
].join("");
const Editor = styled(Medixtor)`
  border: solid 1px var(--color-border) !important;
  flex-grow: unset;
  min-height: 30rem;

  .editor {
    color: var(--color-black-leather-jacket);
  }
  .editor-menu-container button {
    display: inline-flex;
  }

  .preview {
    line-height: 1.4;
    padding-top: 0 !important;

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
        background: url(${aIconUri}) 100% 50% / 15px no-repeat;
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
const AnswerProposal = styled(Editor)`
  border-right: 0 !important;

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
const AnswerCorrection = styled(Editor)`
  .editor {
    background-color: white;
    border: 0 !important;
  }
  .editor-status {
    min-height: 1.5rem;
  }

  .preview {
    background-color: white;
  }
`;
const Strong = styled.p`
  font-weight: 600;
  margin: ${props => (Boolean(props.isFirst) ? "0 0 0.5rem" : "1rem 0 0.5rem")};
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
    !Boolean(isPrivate)
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
  opacity: ${props => (Boolean(props.disabled) ? 0.25 : 1)};
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
      isUpdating: false,
      isLoading: true,
      otherReferenceUrlInputKey: 0,
      otherReferenceValueInputKey: 2,
      prevalue: null,
      references: [],
      isSidebarHidden: true,
      value: ""
    };

    this.isGeneric = Boolean(props.isGeneric);
    this.updateAnswerValue = debounce(this._updateAnswerValue.bind(this), 500);
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  async componentDidMount() {
    this.axios = customAxios();

    try {
      this.fetchAnswer();
      await this.loadReferences();
      this.props.dispatch(actions.comments.load(this.props.id));

      this.setState({ isLoading: false });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  componentDidUpdate() {
    if (!this.props.answers.isLoading) {
      if (this.state.prevalue === null || this.state.value === null) {
        const { prevalue, value } = this.props.answers.data;

        this.setState({
          prevalue,
          value
        });
      }
    }

    if (!this.state.isLoading && !this.props.answers.isLoading && !this.props.comments.isLoading) {
      this.$commentsContainer.scrollTo(0, this.$commentsContainer.scrollHeight);
    }
  }

  fetchAnswer() {
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
        isUpdating: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
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

    dispatch(
      actions.answers.updateGenericReference([id], generic_reference, this.fetchAnswer.bind(this))
    );
  }

  async createTag(tagId) {
    try {
      const { state } = this.props.answers.data;
      const answersUri = `/answers?id=eq.${this.props.id}`;

      // An answer can't have a custom tag and be generic at the same time:
      const answersData = {
        generic_reference: null
      };

      // An answer can't have a "to do" state with a tag:
      if (state === ANSWER_STATE.TO_DO) {
        answersData.state = ANSWER_STATE.UNDER_REVIEW;
      }

      const answersTagsUri = `/answers_tags`;
      const answersTagsData = {
        answer_id: this.props.id,
        tag_id: tagId
      };

      await this.axios.patch(answersUri, answersData);
      await this.axios.post(answersTagsUri, answersTagsData);
    } catch (err) {
      console.warn(err);
    }

    await this.fetchTags();
  }

  async deleteTag(tagId) {
    try {
      const uri = makeApiFilter("/answers_tags", {
        answer_id: this.props.id,
        tag_id: tagId
      });

      await this.axios.delete(uri);
    } catch (err) {
      console.warn(err);
    }

    await this.fetchTags();
  }

  async createReference(reference) {
    this.setState({ isUpdating: true });

    try {
      const { state } = this.props.answers.data;
      const answersUri = `/answers?id=eq.${this.props.id}`;

      // An answer can't have a reference and be generic at the same time:
      const answersData = {
        generic_reference: null
      };

      // An answer can't have a "to do" state with a reference:
      if (state === ANSWER_STATE.TO_DO) {
        answersData.state = ANSWER_STATE.UNDER_REVIEW;
      }

      const answersReferencesUri = `/answers_references`;
      const answersReferencesData = {
        answer_id: this.props.id,
        ...reference
      };

      await this.axios.patch(answersUri, answersData);
      await this.axios.post(answersReferencesUri, answersReferencesData);
    } catch (err) {
      console.warn(err);
    }

    await this.loadReferences();
  }

  async deleteReference(id) {
    this.setState({ isUpdating: true });

    try {
      const uri = makeApiFilter("/answers_references", { id });

      await this.axios.delete(uri);
    } catch (err) {
      console.warn(err);
    }

    await this.loadReferences();
  }

  submitReference(event, category = null) {
    event.preventDefault();
    this.setState({ isUpdating: true });

    let reference;
    if (category === "agreement") {
      reference = {
        category,
        value: this.$agreementReferenceValueInput.value.trim()
      };

      this.setState({
        agreementReferenceValueInputKey: this.state.agreementReferenceValueInputKey + 1
      });
    } else {
      const url = this.$otherReferenceUrlInput.value.trim();
      reference = {
        category,
        url: url.length !== 0 ? url : null,
        value: this.$otherReferenceValueInput.value.trim()
      };

      this.setState({
        otherReferenceUrlInputKey: this.state.otherReferenceUrlInputKey + 1,
        otherReferenceValueInputKey: this.state.otherReferenceValueInputKey + 1
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
            savingSpinnerTimeout: 0
          }),
        500
      )
    });
  }

  toggleSidebar() {
    this.setState({ isSidebarHidden: !this.state.isSidebarHidden });
  }

  toggleTag(id, isAdded) {
    this.setState({ isUpdating: true });

    if (isAdded) {
      this.createTag(id);
    } else {
      this.deleteTag(id);
    }
  }

  toggleIsPublished() {
    const { id, is_published } = this.props.answers.data;

    this.props.dispatch(
      actions.answers.updateIsPublished([id], !is_published, this.fetchAnswer.bind(this))
    );
  }

  handleCommentField(event) {
    if (event.charCode !== 13) return;

    if (event.shiftKey) {
      event.preventDefault();
      this.props.dispatch(actions.comments.toggleOnePrivacy());

      return;
    }

    const value = this.$commentTextarea.value.trim();
    if (value.length === 0) return;

    if (event.ctrlKey) {
      this.props.dispatch(
        actions.comments.addOne(value, this.props.comments.currentIsPrivate, this.props.id)
      );
    }
  }

  removeComment(id) {
    this.props.dispatch(actions.comments.remove([id], this.props.id));
  }

  renderReferences(category, isDisabled) {
    const references = this.state.references.filter(
      ({ category: _category }) => _category === category
    );

    if (this.props.answers.data.state === ANSWER_STATE.VALIDATED && references.length === 0) {
      return <span>Aucune référence.</span>;
    }

    return references.map(({ id, url, value }, index) => (
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
    const { answers, comments } = this.props;
    const { isLoading, prevalue, isSidebarHidden, value } = this.state;

    if (isLoading || answers.isLoading || prevalue === null || value === null) {
      return <AdminMain isLoading />;
    }

    const { agreement, generic_reference, is_published, question, state } = answers.data;
    const stateSelectValue = ANSWER_STATE_OPTIONS.find(({ value }) => value === state);

    return (
      <AdminMain isScrollable={false}>
        <Container>
          <Content flexDirection="column">
            <Flex alignItems="baseline" justifyContent="space-between">
              <Flex alignItems="baseline">
                {this.isGeneric ? <Idcc /> : <Idcc code={agreement.idcc} name={agreement.name} />}
                <Title isFirst>{`${question.index}) ${question.value}`}</Title>
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
                  <Strong isFirst>Articles du Code du travail</Strong>
                  <LawReferences
                    isDisabled={this.state.isUpdating}
                    onAdd={this.createReference.bind(this)}
                    onRemove={this.deleteReference.bind(this)}
                    references={this.state.references.filter(
                      ({ category }) => category === "labor_code"
                    )}
                  />
                </Flex>
                <Form onSubmit={event => this.submitReference(event, "agreement")}>
                  <Strong>Articles de la Convention collective</Strong>
                  <Input
                    disabled={this.state.isUpdating}
                    key={this.state.agreementReferenceValueInputKey}
                    placeholder="Ex: Article 7, Texte sur les salaires de 1984…"
                    ref={node => (this.$agreementReferenceValueInput = node)}
                  />
                  <Flex flexWrap="wrap">{this.renderReferences("agreement")}</Flex>
                  <FormHiddenSubmit type="submit" />
                </Form>
                <Form onSubmit={this.submitReference.bind(this)}>
                  <Strong>Autres références juridiques</Strong>
                  <Input
                    disabled={this.state.isUpdating}
                    key={this.state.otherReferenceValueInputKey}
                    // eslint-disable-next-line max-len
                    placeholder="Référence (ex: Décret n°82-447 du 28 mai 1982…)"
                    ref={node => (this.$otherReferenceValueInput = node)}
                  />
                  <Input
                    disabled={this.state.isUpdating}
                    key={this.state.otherReferenceUrlInputKey}
                    placeholder="URL (ex: https://www.legifrance.gouv.fr/…)"
                    ref={node => (this.$otherReferenceUrlInput = node)}
                  />
                  <Flex flexWrap="wrap">{this.renderReferences(null)}</Flex>
                  <FormHiddenSubmit type="submit" />
                </Form>
                <Hr />

                <Subtitle isFirst>Renvoi</Subtitle>
                <Radio
                  disabled={state === ANSWER_STATE.VALIDATED}
                  onChange={this.updateGenericReference.bind(this)}
                  options={[
                    {
                      label: "Aucun renvoi.",
                      value: null,
                      isSelected: generic_reference === null
                    },
                    {
                      label: "Renvoyée au texte Code du Travail.",
                      value: "labor_code",
                      isSelected: generic_reference === "labor_code"
                    },
                    {
                      label: "Renvoyée au texte de la CCN.",
                      value: "national_agreement",
                      isSelected: generic_reference === "national_agreement"
                    }
                  ]}
                />
              </Flex>
            )}

            {state === ANSWER_STATE.VALIDATED && (
              <Flex flexDirection="column" width={1}>
                <Subtitle isFirst>Réponse validée</Subtitle>
                <AnswerCorrection defaultValue={value} disabled headersOffset={2} isSingleView />

                <Subtitle>Références juridiques</Subtitle>
                <Strong>Convention collective</Strong>
                <Flex flexWrap="wrap">{this.renderReferences("agreement", true)}</Flex>
                <Strong>Code du travail</Strong>
                <Flex flexWrap="wrap">{this.renderReferences("labor_code", true)}</Flex>
                <Strong>Autres</Strong>
                <Flex flexWrap="wrap">{this.renderReferences(null, true)}</Flex>
                <Hr />

                <Subtitle isFirst>Renvoi</Subtitle>
                {
                  {
                    labor_code: "Renvoyée au texte Code du Travail.",
                    national_agreement: "Renvoyée au texte de la CCN.",
                    null: "Aucun renvoi."
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
      </AdminMain>
    );
  }
}

export default connect(({ answers, comments }) => ({
  answers,
  comments
}))(AdminAnwsersEditPage);
