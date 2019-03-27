import { find, propEq } from "ramda";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Label from "./Label";

const Container = styled(Flex)`
  background-color: white;
  color: black;
  padding: 0 1rem;
  width: 100%;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 0.8rem;
  margin: 1rem 0 0.75rem;
  text-transform: uppercase;
  user-select: none;
`;
const Input = styled.input`
  border: solid 1px #d3d3d3;
  border-radius: 0.25rem;
  color: inherit;
  font-family: inherit;
  font-weight: inherit;
  font-size: 1rem;
  line-height: 1.25;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.1rem;
  width: 100%;

  ::placeholder {
    color: #bbbbbb;
    font-style: italic;
  }
`;
const Submit = styled.button`
  -webkit-appearance: none;
  border: 0;
  height: 0;
  padding: 0;
  width: 0;
`;

const List = styled(Flex)`
  flex-wrap: wrap;
`;

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      references: props.references
    };
  }

  addReference(event, category) {
    event.preventDefault();

    const value =
      category === null
        ? this.$referenceTitle.value
        : this.$laborCodeReference.value;

    if (find(propEq("value", value), this.state.references) !== undefined) {
      return;
    }

    const reference = {
      category,
      url: category === null ? this.$referenceUrl.value : null,
      value
    };

    this.setState({
      references: [...this.state.references, reference]
    });

    this.props.onAdd(reference);
  }

  removeReference(_value) {
    this.setState({
      references: this.state.references.filter(({ value }) => value !== _value)
    });

    this.props.onRemove(_value);
  }

  getLabels(_category) {
    return this.state.references
      .filter(({ category }) => category === _category)
      .map(({ url, value }, index) => (
        <Label
          key={index}
          onRemove={this.removeReference.bind(this)}
          value={value}
          url={url}
        />
      ));
  }

  render() {
    return (
      <Container flexDirection="column">
        <Title>Articles du Code du travail</Title>
        <form onSubmit={e => this.addReference(e, "labor_code")} role="form">
          <Input
            name="laborCodeReference"
            placeholder="Référence (ex: L. 1234-5)"
            ref={node => (this.$laborCodeReference = node)}
          />
        </form>
        <List>{this.getLabels("labor_code")}</List>

        <Title>Autre (décret, règlementation, circulaire, jurisprudence)</Title>
        <form onSubmit={e => this.addReference(e, null)} role="form">
          <Input
            placeholder="Référence (ex: Décret n° 1 du 1er janvier 2019)"
            ref={node => (this.$referenceTitle = node)}
          />
          <Input
            placeholder="Lien (ex: https://...)"
            ref={node => (this.$referenceUrl = node)}
          />
          <Submit type="submit" />
        </form>
        <List>{this.getLabels(null)}</List>
      </Container>
    );
  }
}
