import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

import _Subtitle from "../../elements/Subtitle";
import Tag from "../../elements/Tag";

const Container = styled(Flex)`
  color: #555555;
  flex-grow: 1;
  padding: 1rem;
`;
const Subtitle = styled(_Subtitle)`
  font-size: 0.875rem;
  font-weight: 700;
`;

export default class AnswerEditionTagsBlock extends React.PureComponent {
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
      this.props.onToggle(id, false);

      return;
    }

    this.setState({ selectedTags: [...this.state.selectedTags, id] });
    this.props.onToggle(id, true);
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
        <_Subtitle isFirst>Étiquettes</_Subtitle>
        <p>
          Sélectionnez les étiquettes correspondant à la réponse que vous rédigez afin de nous aider
          à classifier le contenu:
        </p>

        <Flex flexDirection="column">
          <Subtitle isFirst>Type de contrat</Subtitle>
          <Flex flexWrap="wrap">{this.getTags("contract_type")}</Flex>
        </Flex>

        <Flex flexDirection="column">
          <Subtitle>Cible</Subtitle>
          <Flex flexWrap="wrap">{this.getTags("target")}</Flex>
        </Flex>

        <Flex flexDirection="column">
          <Subtitle>Durée de travail</Subtitle>
          <Flex flexWrap="wrap">{this.getTags("work_time")}</Flex>
        </Flex>

        <Flex flexDirection="column">
          <Subtitle>{"Type d'horaires"}</Subtitle>
          <Flex flexWrap="wrap">{this.getTags("work_schedule_type")}</Flex>
        </Flex>

        <Flex flexDirection="column">
          <Subtitle>Particularismes</Subtitle>
          <Flex flexWrap="wrap">{this.getTags("distinctive_identity")}</Flex>
        </Flex>
      </Container>
    );
  }
}
