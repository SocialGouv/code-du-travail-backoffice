import styled from "@emotion/styled";
import React from "react";
import ReactTagAutocomplete from "react-tag-autocomplete";
import { Flex } from "rebass";

import Reference from "./Reference";

// eslint-disable-next-line prettier/prettier
const LAW_REFERENCES = require("../data/labor-law-references.json");

const Container = styled.div`
  .react-tags__selected > button {
    border: solid 1px var(--color-border);
  }

  .react-tags__search-input > input {
    -webkit-appearance: none;
    background-color: transparent;
    border: solid 1px var(--color-border);
    color: inherit;
    flex-grow: 1;
    font-family: inherit;
    font-weight: inherit;
    font-size: 0.875rem;
    height: 2rem;
    line-height: 1;
    padding: 0.5rem 0.6rem 0.55rem;
    width: 100% !important;

    ::placeholder {
      color: var(--color-placeholder);
    }
  }

  .react-tags__suggestions > ul {
    list-style: none;
    padding: 0;

    li {
      background-color: var(--color-alice-blue);
      border: solid 1px var(--color-border);
      border-top: 0;
      cursor: pointer;
      padding: 0.25rem 0.5rem;

      &.is-active {
        background-color: var(--color-cadet-grey);
      }
    }
  }
`;

export default class LawReferences extends React.PureComponent {
  constructor(props) {
    super(props);

    this.references = props.references.map(({ value }) => value);

    this.state = {
      suggestions: this.getSuggestions(),
    };
  }

  getSuggestions() {
    return LAW_REFERENCES.filter(value => !this.references.includes(value)).map(value => ({
      id: value,
      name: value,
    }));
  }

  async onAdd(ref) {
    this.setState({ isLoading: true });
    const value = ref.name;

    await this.props.onAdd({
      category: "labor_code",
      value,
    });

    this.references.push(value);
    this.setState({
      isLoading: false,
      suggestions: this.getSuggestions(),
    });
  }

  async onRemove(index) {
    this.setState({ isLoading: true });
    const value = this.state.suggestions[index].name;

    await this.props.onRemove({
      category: "labor_code",
      value,
    });

    this.references = this.references.filter(name => name !== value);
    this.setState({
      isLoading: false,
      suggestions: this.getSuggestions(),
    });
  }

  getReferences() {
    return this.props.references.map(({ id, value }, index) => (
      <Reference key={index} onRemove={() => this.props.onRemove(id)} value={value} />
    ));
  }

  render() {
    return (
      <Container>
        <ReactTagAutocomplete
          autofocus={false}
          handleAddition={this.onAdd.bind(this)}
          handleDelete={this.onRemove.bind(this)}
          inputAttributes={{ disabled: this.props.isDisabled }}
          placeholder="Commencez à taper la référence au Code du travail"
          suggestions={this.state.suggestions}
        />
        <Flex flexWrap="wrap">{this.getReferences()}</Flex>
      </Container>
    );
  }
}
