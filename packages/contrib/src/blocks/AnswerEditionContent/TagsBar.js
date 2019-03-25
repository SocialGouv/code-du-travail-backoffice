import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Tag from "../../elements/Tag";

const Container = styled(Flex)`
  background-color: #d7d7d7;
  color: #555555;
  padding: 0 1rem;
`;
const Title = styled.p`
  font-weight: 600;
  font-size: 0.8rem;
  margin: 1rem 0 0.75rem;
  text-transform: uppercase;
  user-select: none;
`;

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedTags: this.props.selectedTags
    };
  }

  toggleTag(id) {
    if (this.state.selectedTags.includes(id)) {
      this.setState({
        selectedTags: this.state.selectedTags.filter(_id => _id !== id)
      });
      this.props.onToggleTag(id, false);

      return;
    }

    this.setState({ selectedTags: [...this.state.selectedTags, id] });
    this.props.onToggleTag(id, true);
  }

  getTags(category) {
    return this.props.tags
      .filter(tag => tag.category === category)
      .map(({ id, value }, index) => (
        <Tag
          key={index}
          onClick={() => this.toggleTag(id)}
          selected={this.state.selectedTags.includes(id)}
        >
          {value}
        </Tag>
      ));
  }

  render() {
    return (
      <Container className={this.props.className} flexDirection="column">
        <Flex flexDirection="column">
          <Title>Type de contrat</Title>
          <Flex flexWrap="wrap">{this.getTags("contract_type")}</Flex>
        </Flex>

        <Flex flexDirection="column">
          <Title>Cible</Title>
          <Flex flexWrap="wrap">{this.getTags("target")}</Flex>
        </Flex>

        <Flex flexDirection="column">
          <Title>Durée de travail</Title>
          <Flex flexWrap="wrap">{this.getTags("work_time")}</Flex>
        </Flex>

        <Flex flexDirection="column">
          <Title>{"Type d'horaires"}</Title>
          <Flex flexWrap="wrap">{this.getTags("work_schedule_type")}</Flex>
        </Flex>

        <Flex flexDirection="column">
          <Title>Particularismes</Title>
          <Flex flexWrap="wrap">{this.getTags("distinctive_identity")}</Flex>
        </Flex>
      </Container>
    );
  }
}
