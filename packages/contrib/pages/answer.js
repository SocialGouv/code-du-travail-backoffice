import debounce from "lodash.debounce";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Editor from "../src/components/Editor";
import Idcc from "../src/elements/Idcc";
import SavingSpinner from "../src/elements/SavingSpinner";
import Tag from "../src/elements/Tag";
import Title from "../src/elements/Title";
import Main from "../src/layouts/Main";
import customAxios from "../src/lib/customAxios";
import makeApiFilter from "../src/lib/makeApiFilter";

import "../node_modules/medium-editor/dist/css/medium-editor.css";
import "../node_modules/medium-editor/dist/css/themes/beagle.css";

const Content = styled(Flex)`
  background-color: #f3f3f3;
`;
const ContentLabel = styled.span`
  color: #c2c2c2;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 1rem;
  margin-top: 1rem;
  user-select: none;
`;
const ContentEditor = styled(Editor)`
  flex-grow: 1;
  padding: 1rem;
`;
const ContentInfo = styled(Flex)`
  bottom: 1rem;
  color: #888888;
  font-size: 0.8rem;
  position: absolute;
  right: 1.75rem;
  width: 15.5rem;
`;

const SideBar = styled(Flex)`
  background-color: #d7d7d7;
  color: #555555;
  padding: 0 1rem;
`;
const SideBarTitle = styled.p`
  font-weight: 600;
  font-size: 0.8rem;
  margin: 1rem 0 0.75rem;
  text-transform: uppercase;
  user-select: none;
`;

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answerTags: [],
      isLoading: true,
      isSaving: false
    };

    this.answerValue = "";
    this.originalAnswer = null;
    this.tags = [];

    this.deleteAnswerTag = debounce(this._deleteAnswerTag.bind(this), 500);
    this.insertAnswerTag = debounce(this._insertAnswerTag.bind(this), 500);
    this.saveAnswerValue = debounce(this._saveAnswerValue.bind(this), 500);
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  componentDidMount() {
    this.axios = customAxios();

    const myAnswersFilter = `id=eq.${this.props.id}`;

    Promise.all([
      this.axios.get(`/tags`),
      this.axios.get(`/my_answers?${myAnswersFilter}`)
    ])
      .then(([tagsRes, answersRes]) => {
        this.originalAnswer = answersRes.data[0];
        this.answerValue = answersRes.data[0].value;
        this.tags = tagsRes.data;

        this.setState({
          answerTags: this.originalAnswer.tags,
          isLoading: false
        });
      })
      .catch(console.warn);
  }

  toggleTag(tagId) {
    if (this.state.answerTags.includes(tagId)) {
      this.deleteAnswerTag(tagId);
      this.setState({
        answerTags: [...this.state.answerTags.filter(id => id !== tagId)]
      });

      return;
    }

    this.insertAnswerTag(tagId);
    this.setState({
      answerTags: [...this.state.answerTags, tagId]
    });
  }

  async _saveAnswerValue(value) {
    this.setState({ isSaving: true });

    const uri = `/answers?id=eq.${this.props.id}`;
    const data = { value };

    await this.axios.patch(uri, data).catch(console.warn);

    this.setState({ isSaving: false });
  }

  async _insertAnswerTag(tagId) {
    this.setState({ isSaving: true });

    const uri = `/answers_tags`;
    const data = {
      // id: 1,
      answer_id: this.props.id,
      tag_id: tagId
    };

    await this.axios.post(uri, data).catch(console.warn);

    this.setState({ isSaving: false });
  }

  async _deleteAnswerTag(tagId) {
    this.setState({ isSaving: true });

    const uri = makeApiFilter("/answers_tags", {
      answer_id: this.props.id,
      tag_id: tagId
    });

    await this.axios.delete(uri).catch(console.warn);

    this.setState({ isSaving: false });
  }

  getTagsList(tagCategory) {
    return this.tags
      .filter(tag => tag.category === tagCategory)
      .map((tag, index) => this.getTagsListRow(tag, index));
  }

  getTagsListRow(tag, index) {
    return (
      <Tag
        key={String(index)}
        onClick={() => this.toggleTag(tag.id)}
        selected={this.state.answerTags.includes(tag.id)}
      >
        {tag.value}
      </Tag>
    );
  }

  render() {
    if (this.state.isLoading) return <Main isLoading />;

    return (
      <Main isHorizontal>
        <Content flexDirection="column" width={3 / 5}>
          <Flex alignItems="flex-start" justifyContent="space-between">
            <ContentLabel>Brouillon</ContentLabel>
            <Idcc
              code={this.originalAnswer.idcc}
              name={this.originalAnswer.agreement}
            />
          </Flex>
          <Title style={{ marginTop: 0 }}>
            {this.originalAnswer.question}
          </Title>
          <ContentEditor
            defaultValue={this.originalAnswer.value}
            onChange={this.saveAnswerValue}
          />
          {this.state.isSaving && (
            <ContentInfo alignItems="center" justifyContent="space-between">
              <SavingSpinner color="#888888" size="26" />
              Sauvegarde automatique en cours…
            </ContentInfo>
          )}
        </Content>
        <SideBar width={2 / 5} flexDirection="column">
          <Flex flexDirection="column">
            <SideBarTitle>Thèmes</SideBarTitle>
            <Flex flexWrap="wrap">{this.getTagsList("theme")}</Flex>
          </Flex>

          <Flex flexDirection="column">
            <SideBarTitle>Type de contrat</SideBarTitle>
            <Flex flexWrap="wrap">{this.getTagsList("contract_type")}</Flex>
          </Flex>

          <Flex flexDirection="column">
            <SideBarTitle>Cible</SideBarTitle>
            <Flex flexWrap="wrap">{this.getTagsList("target")}</Flex>
          </Flex>

          <Flex flexDirection="column">
            <SideBarTitle>Durée du travail</SideBarTitle>
            <Flex flexWrap="wrap">{this.getTagsList("work_time")}</Flex>
          </Flex>

          <Flex flexDirection="column">
            <SideBarTitle>{"Type d'horaires"}</SideBarTitle>
            <Flex flexWrap="wrap">
              {this.getTagsList("work_schedule_type")}
            </Flex>
          </Flex>

          <Flex flexDirection="column">
            <SideBarTitle>Particularismes</SideBarTitle>
            <Flex flexWrap="wrap">
              {this.getTagsList("distinctive_identity")}
            </Flex>
          </Flex>
        </SideBar>
      </Main>
    );
  }
}
