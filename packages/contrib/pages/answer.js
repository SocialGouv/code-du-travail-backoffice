import axios from "axios";
import io from "socket.io-client";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Editor from "../src/components/Editor";
import Tag from "../src/elements/Tag";
import Title from "../src/elements/Title";
import Main from "../src/layouts/Main";

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
      isLoading: true,

      contract_type: [],
      distinctive_identity: [],
      target: [],
      theme: [],
      work_schedule_type: [],
      work_time: []
    };

    this.tags = [];

    this.updateFormData = this.updateFormData.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  static getInitialProps({ query: { id } }) {
    return { id };
  }

  componentDidMount() {
    this.socket = io();

    const filter = `id=eq.${this.props.id}`;
    const select = "select=*,question(value),labor_agreement(idcc,name)";

    Promise.all([
      axios.get(`http://localhost:3200/tags`),
      axios.get(`http://localhost:3200/answers?${filter}&${select}`)
    ])
      .then(res => {
        this.tags = res[0].data;
        this.answer = res[1].data[0];
        this.setState({
          isLoading: false,
          value: res[1].data[0].value
        });
      })
      .catch(console.warn);
  }

  componentDidUpdate() {
    if (!this.state.isLoading) this.save();
  }

  updateFormData(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  toggleCheckbox(field, theme) {
    if (this.state[field].includes(theme)) {
      this.setState({
        [field]: [...this.state[field].filter(_theme => _theme !== theme)]
      });

      return;
    }

    this.setState({
      [field]: [...this.state[field], theme]
    });
  }

  updateValue(markdownSource) {
    this.value = markdownSource;
    this.save();
  }

  save() {
    const uri = `http://localhost:3200/answers?id=eq.${this.props.id}`;
    const data = {
      value: this.value
    };
    const config = {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("jwt")}` }
    };

    axios.patch(uri, data, config).catch(console.warn);
  }

  getCheckboxList(category) {
    return this.tags
      .filter(tag => tag.category === category)
      .map(({ value }, index) =>
        this.getCheckboxListRow(category, value, index)
      );
  }

  getCheckboxListRow(field, value, index) {
    return (
      <Tag
        key={String(index)}
        onClick={() => this.toggleCheckbox(field, value)}
        selected={this.state[field].includes(value)}
      >
        {value}
      </Tag>
    );
  }

  render() {
    if (this.state.isLoading) return <Main>Loading...</Main>;

    const contractTypes = this.getCheckboxList("contract_type");
    const distinctiveIdentities = this.getCheckboxList("distinctive_identity");
    const targets = this.getCheckboxList("target");
    const themes = this.getCheckboxList("theme");
    const workScheduleTypes = this.getCheckboxList("work_schedule_type");
    const workTimes = this.getCheckboxList("work_time");

    return (
      <Main isHorizontal>
        <Content flexDirection="column" width={3 / 5}>
          <Label>Brouillon</Label>
          <Title style={{ marginTop: 0 }}>{this.answer.question.value}</Title>
          <Editor
            defaultValue={this.state.value}
            onChange={this.updateValue}
            style={{
              background: "#f3f3f3",
              flexGrow: 1,
              padding: "1rem"
            }}
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
