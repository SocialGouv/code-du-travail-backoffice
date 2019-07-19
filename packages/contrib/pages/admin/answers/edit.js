import debounce from "lodash.debounce";
import Router from "next/router";
import React from "react";
import { connect } from "react-redux";
import { Flex } from "rebass";
import styled from "styled-components";

import * as actions from "../../../src/actions";
import Comment from "../../../src/components/Comment";
import LawReferences from "../../../src/components/LawReferences";
import Reference from "../../../src/components/Reference";
import AdminMain from "../../../src/layouts/AdminMain";
import _Button from "../../../src/elements/Button";
import Hr from "../../../src/elements/Hr";
import Idcc from "../../../src/elements/Idcc";
import Input from "../../../src/elements/Input";
import SavingSpinner from "../../../src/elements/SavingSpinner";
import Subtitle from "../../../src/elements/Subtitle";
import Tag from "../../../src/elements/Tag";
import Textarea from "../../../src/elements/Textarea";
import Title from "../../../src/elements/Title";
import customAxios from "../../../src/libs/customAxios";
import makeApiFilter from "../../../src/libs/makeApiFilter";

import { ANSWER_STATE } from "../../../src/constants";
import T from "../../../src/texts";

const Container = styled(Flex)`
  height: 100%;
`;
const LeftContainer = styled(Flex)`
  overflow-y: scroll;
  padding: 1rem;
`;
const RightContainer = styled(Flex)`
  padding: 1rem;
`;

const AnswerEditor = styled(Textarea)`
  flex-grow: unset;
  min-height: 15rem;
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

const Comments = styled(Flex)`
  flex-grow: 1;
  margin-top: 0.5rem;
  max-height: 100%;
  overflow-y: scroll;
`;
const CommentField = styled.div`
  margin: 1rem 0;
  min-height: 9rem;
`;
const CommentEditor = styled(Textarea)`
  font-size: 0.75rem;
  opacity: ${props => (Boolean(props.disabled) ? 0.25 : 1)};
  padding: 0.5rem;
  width: 100%;
`;
const Button = styled(_Button)`
  justify-content: center;
  margin-bottom: ${({ isFirst }) => (Boolean(isFirst) ? "0.5rem" : 0)};
`;

class AdminAnwsersEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      agreementReferenceValueInputKey: 0,
      isUpdating: false,
      isLoading: true,
      otherReferenceUrlInputKey: 0,
      otherReferenceValueInputKey: 2,
      references: [],
      tags: []
    };

    this.updateAnswerValue = debounce(this._updateAnswerValue.bind(this), 500);
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  async componentDidMount() {
    this.axios = customAxios();

    try {
      // eslint-disable-next-line prettier/prettier
      const answersSelect =
        `select=*,agreement(idcc,name),question(index,value),user(name)`;
      const answersWhere = `id=eq.${this.props.id}`;
      const answersUri = `/answers?${answersSelect}&${answersWhere}`;
      const { data: answers } = await this.axios.get(answersUri);

      const tagsUri = `/tags`;
      const { data: tags } = await this.axios.get(tagsUri);

      this.answer = answers[0];
      this.tags = tags;

      await this.fetchTags();
      await this.fetchReferences();
      this.props.dispatch(actions.comments.load(this.props.id));

      this.setState({ isLoading: false });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  componentDidUpdate() {
    if (!this.state.isLoading) {
      this.$commentsContainer.scrollTo(0, this.$commentsContainer.scrollHeight);

      if (this.answerValueEditor === undefined) {
        // We have to load Quill here because of the global `navigator` variable
        // check done by the original library.
        const SimpleMDE = require("simplemde");

        const config = {
          spellChecker: false,
          status: false
        };

        this.answerPrevalueEditor = new SimpleMDE({
          ...config,
          element: this.$answerPrevalue,
          toolbar: ["preview"]
        });

        this.answerValueEditor = new SimpleMDE({
          ...config,
          element: this.$answerValue,
          toolbar: [
            "bold",
            "italic",
            "|",
            "unordered-list",
            "ordered-list",
            "quote",
            "|",
            "preview",
            "side-by-side",
            "fullscreen",
            "|",
            "guide"
          ]
        });

        this.answerValueEditor.codemirror.on(
          "change",
          this.updateAnswerValue.bind(this)
        );
      }
    }
  }

  async fetchTags() {
    try {
      const tagsSelect = `select=tags(id,value)`;
      const tagsWhere = `answer_id=eq.${this.props.id}`;
      const tagsUri = `/answers_tags?${tagsSelect}&${tagsWhere}`;
      const { data: tags } = await this.axios.get(tagsUri);

      this.setState({
        tags: tags.map(({ tags: { id } }) => id),
        isUpdating: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  async fetchReferences() {
    try {
      const referencesSelect = `select=*`;
      const referencesWhere = `answer_id=eq.${this.props.id}`;
      // eslint-disable-next-line prettier/prettier
      const referencesUri =
        `/answers_references?${referencesSelect}&${referencesWhere}`;
      const { data: references } = await this.axios.get(referencesUri);

      this.setState({
        references,
        isUpdating: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  async fetchComments() {
    try {
      const commentsSelect = `select=*`;
      const commentsWhere = `answer_id=eq.${this.props.id}`;
      // eslint-disable-next-line prettier/prettier
      const commentsUri =
        `/answers_comments?${commentsSelect}&${commentsWhere}`;
      const { data: comments } = await this.axios.get(commentsUri);

      this.setState({
        comments,
        isUpdating: false
      });
    } catch (err) {
      if (err !== undefined) console.warn(err);
    }
  }

  async updateAnswerStateTo(state) {
    this.setState({ isLoading: true });

    try {
      const uri = `/answers?id=eq.${this.props.id}`;
      const data = { state };

      await this.axios.patch(uri, data);

      Router.push("/admin/answers");
    } catch (err) {
      console.warn(err);
    }
  }

  async _updateAnswerValue() {
    this.setState({ isUpdating: true });

    try {
      const uri = `/answers?id=eq.${this.props.id}`;
      // An answer can't have a value and be generic at the same time:
      const data = {
        generic_reference: null,
        state: ANSWER_STATE.UNDER_REVIEW,
        value: this.answerValueEditor.value()
      };

      await this.axios.patch(uri, data);

      this.answer.value = this.$answerValue.value;
    } catch (err) {
      console.warn(err);
    }

    this.setState({ isUpdating: false });
  }

  async insertTag(tagId) {
    try {
      const answersUri = `/answers?id=eq.${this.props.id}`;
      // An answer can't have a custom tag and be generic at the same time:
      const answersData = {
        generic_reference: null
      };
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

  async insertReference(reference) {
    this.setState({ isUpdating: true });

    try {
      const answersUri = `/answers?id=eq.${this.props.id}`;
      // An answer can't have a reference and be generic at the same time:
      const answersData = {
        generic_reference: null
      };
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

    await this.fetchReferences();
  }

  async deleteReference(id) {
    this.setState({ isUpdating: true });

    try {
      const uri = makeApiFilter("/answers_references", { id });

      await this.axios.delete(uri);
    } catch (err) {
      console.warn(err);
    }

    await this.fetchReferences();
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
        agreementReferenceValueInputKey:
          this.state.agreementReferenceValueInputKey + 1
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

    this.insertReference(reference);
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

  toggleTag(id, isAdded) {
    this.setState({ isUpdating: true });

    if (isAdded) {
      this.insertTag(id);
    } else {
      this.deleteTag(id);
    }
  }

  maybeAddComment(event) {
    if (
      !event.ctrlKey ||
      event.charCode !== 13 ||
      this.$commentTextarea.value.trim().length === 0
    ) {
      return;
    }

    this.props.dispatch(
      actions.comments.add(this.props.id, this.$commentTextarea.value)
    );
  }

  removeComment(id) {
    this.props.dispatch(actions.comments.remove(id, this.props.id));
  }

  getTags(category) {
    return this.tags
      .filter(tag => tag.category === category)
      .map(({ id, value }, index) => (
        <Tag
          key={index}
          isDisabled={this.state.isUpdating}
          onClick={() => this.toggleTag(id, !this.state.tags.includes(id))}
          selected={this.state.tags.includes(id)}
        >
          {value}
        </Tag>
      ));
  }

  getReferences(category = null) {
    return this.state.references
      .filter(({ category: _category }) => _category === category)
      .map(({ id, url, value }, index) => (
        <Reference
          key={index}
          onRemove={() => this.deleteReference(id)}
          url={url}
          value={value}
        />
      ));
  }

  getComments() {
    return this.props.comments.data.map(({ id, value }, index) => (
      <Comment
        isMe={true}
        key={index}
        onRemove={() => this.removeComment(id)}
        value={value}
      />
    ));
  }

  render() {
    const { comments } = this.props;

    if (this.state.isLoading) return <AdminMain isLoading />;

    return (
      <AdminMain>
        <Container>
          <LeftContainer flexDirection="column" width={0.65}>
            <Flex alignItems="baseline">
              <Idcc
                code={this.answer.agreement.idcc}
                name={this.answer.agreement.name}
              />
              <Title isFirst>{this.answer.question.value}</Title>
            </Flex>

            <Hr />
            <Subtitle isFirst>Réponse proposée</Subtitle>

            <AnswerEditor
              defaultValue={this.answer.prevalue}
              disabled
              ref={node => (this.$answerPrevalue = node)}
            />

            <Hr />
            <Subtitle isFirst>Réponse corrigée</Subtitle>

            <AnswerEditor
              defaultValue={this.answer.value}
              onChange={this.updateAnswerValue}
              ref={node => (this.$answerValue = node)}
            />

            <Hr />
            <Subtitle isFirst>Références juridiques</Subtitle>

            <Flex flexDirection="column">
              <Strong isFirst>Articles du Code du travail</Strong>
              <LawReferences
                isDisabled={this.state.isUpdating}
                onAdd={this.insertReference.bind(this)}
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
              <Flex flexWrap="wrap">{this.getReferences("agreement")}</Flex>
              <FormHiddenSubmit type="submit" />
            </Form>

            <Form onSubmit={this.submitReference.bind(this)}>
              <Strong>Autres références juridiques</Strong>
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
              />
              <Flex flexWrap="wrap">{this.getReferences()}</Flex>
              <FormHiddenSubmit type="submit" />
            </Form>

            <Hr />
            <Subtitle isFirst>Étiquettes</Subtitle>

            <Flex flexDirection="column">
              <Strong isFirst>Type de contrat</Strong>
              <Flex flexWrap="wrap">{this.getTags("contract_type")}</Flex>
            </Flex>

            <Flex flexDirection="column">
              <Strong>Cible</Strong>
              <Flex flexWrap="wrap">{this.getTags("target")}</Flex>
            </Flex>

            <Flex flexDirection="column">
              <Strong>Durée de travail</Strong>
              <Flex flexWrap="wrap">{this.getTags("work_time")}</Flex>
            </Flex>

            <Flex flexDirection="column">
              <Strong>{"Type d'horaires"}</Strong>
              <Flex flexWrap="wrap">{this.getTags("work_schedule_type")}</Flex>
            </Flex>

            <Flex flexDirection="column">
              <Strong>Particularismes</Strong>
              <Flex flexWrap="wrap">
                {this.getTags("distinctive_identity")}
              </Flex>
            </Flex>
          </LeftContainer>
          <RightContainer
            flexDirection="column"
            justifyContent="space-between"
            width={0.35}
          >
            <Flex flexDirection="column">
              <Subtitle isFirst>Commentaires et validation</Subtitle>
              <Comments
                flexDirection="column"
                ref={node => (this.$commentsContainer = node)}
              >
                {this.getComments()}
              </Comments>
              <CommentField>
                <CommentEditor
                  disabled={this.state.isUpdating}
                  key={comments.textareaKey}
                  onKeyPress={this.maybeAddComment.bind(this)}
                  placeholder={T.ADMIN_ANSWERS_COMMENT_PLACEHOLDER}
                  ref={node => (this.$commentTextarea = node)}
                  rows={10}
                />
              </CommentField>
            </Flex>
            {this.answer.state === ANSWER_STATE.DRAFT && (
              <Flex flexDirection="column">
                <Button
                  disabled={this.state.isUpdating}
                  onClick={() =>
                    this.updateAnswerStateTo(ANSWER_STATE.PENDING_REVIEW)
                  }
                >
                  {this.state.isUpdating ? (
                    <SavingSpinner color="white" size="21" />
                  ) : (
                    "Passer en validation"
                  )}
                </Button>
              </Flex>
            )}
            {(this.answer.state === ANSWER_STATE.PENDING_REVIEW ||
              this.answer.state === ANSWER_STATE.UNDER_REVIEW) && (
              <Flex flexDirection="column">
                <Button
                  disabled={this.state.isUpdating}
                  isFirst
                  onClick={() =>
                    this.updateAnswerStateTo(ANSWER_STATE.VALIDATED)
                  }
                >
                  {this.state.isUpdating ? (
                    <SavingSpinner color="white" size="21" />
                  ) : (
                    "Valider la réponse"
                  )}
                </Button>
                <Button
                  color="danger"
                  disabled={this.state.isUpdating}
                  onClick={() => this.updateAnswerStateTo(ANSWER_STATE.DRAFT)}
                >
                  {this.state.isUpdating ? (
                    <SavingSpinner color="white" size="21" />
                  ) : (
                    "Refuser la réponse"
                  )}
                </Button>
              </Flex>
            )}
          </RightContainer>
        </Container>
      </AdminMain>
    );
  }
}

export default connect(({ answers, comments }) => ({
  answers,
  comments
}))(AdminAnwsersEditPage);
