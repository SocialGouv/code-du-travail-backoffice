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
import customAxios from "../src/libs/customAxios";
import makeApiFilter from "../src/libs/makeApiFilter";

import "../node_modules/quill/dist/quill.snow.css";

const Container = styled(Main)`
  overflow-x: hidden;
`;

const ContentHeader = styled(Flex)`
  border-top: solid 1px #cbcbcb;
  min-height: 2rem;
  padding-left: 1rem;
`;
const ContentLabel = styled.span`
  color: #c2c2c2;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 1rem;
  user-select: none;
`;
const ContentInfo = styled(Flex)`
  bottom: 1rem;
  color: #888888;
  font-size: 0.8rem;
  position: absolute;
  right: 1.75rem;
  width: 15.5rem;
`;
const ContentTitle = styled(Title)`
  padding: 0 1rem;
`;

const ContentMain = styled(Flex)`
  flex-grow: 1;
`;
const ContentEditor = styled(Editor)`
  margin-right: ${props => (props.isOpen ? 0 : `-22rem`)};
  transition: flex 1s ease-out;
  width: 100%;
`;
const Sidebar = styled.div`
  background-color: #d7d7d7;
  color: #555555;
  flex: 1 0 22rem;
  padding: 0 1rem;
  transform: ${props => (props.isOpen ? `translateX(0%)` : `translateX(100%)`)};
  transition: flex 1s ease-out;
`;
const SidebarTitle = styled.p`
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
      answerReferences: [],
      answerTags: [],
      isLoading: true,
      isSaving: false,
      isSidebarOpen: false
    };

    this.answerValue = "";
    this.originalAnswer = null;
    this.tags = [];

    this.toggleSidebar = this.toggleSidebar.bind(this);

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
      this.axios.get(`/contributor_answers?${myAnswersFilter}`)
    ])
      .then(([tagsRes, answersRes]) => {
        this.originalAnswer = answersRes.data[0];
        this.answerValue = answersRes.data[0].value;
        this.tags = tagsRes.data;

        this.setState({
          answerReferences: this.originalAnswer.references,
          answerTags: this.originalAnswer.tags,
          isLoading: false
        });

        this.toggleSidebar();

        setTimeout(this.toggleSidebar, 1000);
      })
      .catch(console.warn);
  }

  toggleSidebar() {
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen });
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
      <Container>
        <ContentHeader alignItems="flex-start" justifyContent="space-between">
          <ContentLabel>Brouillon</ContentLabel>
          <Idcc
            code={this.originalAnswer.idcc}
            name={this.originalAnswer.agreement}
          />
        </ContentHeader>
        <ContentTitle isFirst>{this.originalAnswer.question}</ContentTitle>
        <ContentMain>
          <ContentEditor
            defaultValue={this.originalAnswer.value}
            isOpen={this.state.isSidebarOpen}
            onChange={this.saveAnswerValue}
            onTagsClicked={this.toggleSidebar}
          />
          <Sidebar flexDirection="column" isOpen={this.state.isSidebarOpen}>
            <Flex flexDirection="column">
              <SidebarTitle>Thèmes</SidebarTitle>
              <Flex flexWrap="wrap">{this.getTagsList("theme")}</Flex>
            </Flex>

            <Flex flexDirection="column">
              <SidebarTitle>Type de contrat</SidebarTitle>
              <Flex flexWrap="wrap">{this.getTagsList("contract_type")}</Flex>
            </Flex>

            <Flex flexDirection="column">
              <SidebarTitle>Cible</SidebarTitle>
              <Flex flexWrap="wrap">{this.getTagsList("target")}</Flex>
            </Flex>

            <Flex flexDirection="column">
              <SidebarTitle>Durée du travail</SidebarTitle>
              <Flex flexWrap="wrap">{this.getTagsList("work_time")}</Flex>
            </Flex>

            <Flex flexDirection="column">
              <SidebarTitle>{"Type d'horaires"}</SidebarTitle>
              <Flex flexWrap="wrap">
                {this.getTagsList("work_schedule_type")}
              </Flex>
            </Flex>

            <Flex flexDirection="column">
              <SidebarTitle>Particularismes</SidebarTitle>
              <Flex flexWrap="wrap">
                {this.getTagsList("distinctive_identity")}
              </Flex>
            </Flex>
          </Sidebar>
          {this.state.isSaving && (
            <ContentInfo alignItems="center" justifyContent="space-between">
              <SavingSpinner color="#888888" size="26" />
              Sauvegarde automatique en cours…
            </ContentInfo>
          )}
        </ContentMain>
      </Container>
    );
  }
}
