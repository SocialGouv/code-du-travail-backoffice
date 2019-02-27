import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Editor from "../src/components/Editor";
import Tag from "../src/elements/Tag";
import Title from "../src/elements/Title";
import Main from "../src/layouts/Main";
import customAxios from "../src/lib/customAxios";
import makeApiFilter from "../src/lib/makeApiFilter";

import "../node_modules/medium-editor/dist/css/medium-editor.css";
import "../node_modules/medium-editor/dist/css/themes/beagle.css";

const Label = styled.div`
  color: #c2c2c2;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 1rem;
  margin-top: 1rem;
`;

const Content = styled(Flex)`
  background-color: #f3f3f3;
`;
const ContentEditor = styled(Editor)`
  flex-grow: 1;
  padding: 1rem;
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
`;

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answerTags: [],
      isLoading: true
    };

    this.answerValue = "";
    this.originalAnswer = null;
    this.tags = [];

    this.saveAnswerValue = this.saveAnswerValue.bind(this);
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  componentDidMount() {
    this.axios = customAxios();

    const answersFilter = `id=eq.${this.props.id}`;
    const answersSelect = "select=*,question(value),labor_agreement(idcc,name)";
    const answersTagsFilter = `answer_id=eq.${this.props.id}`;
    const answersTagsSelect = "select=tag_id";

    Promise.all([
      this.axios.get(`/tags`),
      this.axios.get(`/answers?${answersFilter}&${answersSelect}`),
      this.axios.get(`/answers_tags?${answersTagsFilter}&${answersTagsSelect}`)
    ])
      .then(([tagsRes, answersRes, answersTagsRes]) => {
        this.originalAnswer = answersRes.data[0];
        this.answerValue = answersRes.data[0].value;
        this.tags = tagsRes.data;

        this.setState({
          answerTags: answersTagsRes.data.map(({ tag_id }) => tag_id),
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

  saveAnswerValue(value) {
    const uri = `/answers?id=eq.${this.props.id}`;
    const data = { value };

    this.axios.patch(uri, data).catch(console.warn);
  }

  insertAnswerTag(tagId) {
    const uri = `/answers_tags`;
    const data = {
      // id: 1,
      answer_id: this.props.id,
      tag_id: tagId
    };

    this.axios.post(uri, data).catch(console.warn);
  }

  deleteAnswerTag(tagId) {
    const uri = makeApiFilter("/answers_tags", {
      answer_id: this.props.id,
      tag_id: tagId
    });

    this.axios.delete(uri).catch(console.warn);
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
    if (this.state.isLoading) return <Main>Loading...</Main>;

    const contractTypes = this.getTagsList("contract_type");
    const distinctiveIdentities = this.getTagsList("distinctive_identity");
    const targets = this.getTagsList("target");
    const themes = this.getTagsList("theme");
    const workScheduleTypes = this.getTagsList("work_schedule_type");
    const workTimes = this.getTagsList("work_time");

    return (
      <Main isHorizontal>
        <Content flexDirection="column" width={3 / 5}>
          <Label>Brouillon</Label>
          <Title style={{ marginTop: 0 }}>
            {this.originalAnswer.question.value}
          </Title>
          <ContentEditor
            defaultValue={this.originalAnswer.value}
            onChange={this.saveAnswerValue}
          />
        </Content>
        <SideBar width={2 / 5} flexDirection="column">
          <Flex flexDirection="column">
            <SideBarTitle>Thèmes</SideBarTitle>
            <Flex flexWrap="wrap">{themes}</Flex>
          </Flex>

          <Flex flexDirection="column">
            <SideBarTitle>Type de contrat</SideBarTitle>
            <Flex flexWrap="wrap">{contractTypes}</Flex>
          </Flex>

          <Flex flexDirection="column">
            <SideBarTitle>Cible</SideBarTitle>
            <Flex flexWrap="wrap">{targets}</Flex>
          </Flex>

          <Flex flexDirection="column">
            <SideBarTitle>Durée du travail</SideBarTitle>
            <Flex flexWrap="wrap">{workTimes}</Flex>
          </Flex>

          <Flex flexDirection="column">
            <SideBarTitle>{"Type d'horaires"}</SideBarTitle>
            <Flex flexWrap="wrap">{workScheduleTypes}</Flex>
          </Flex>

          <Flex flexDirection="column">
            <SideBarTitle>Particularismes</SideBarTitle>
            <Flex flexWrap="wrap">{distinctiveIdentities}</Flex>
          </Flex>
        </SideBar>
      </Main>
    );
  }
}
