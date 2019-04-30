import { find, propEq } from "ramda";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Tags from "../../components/Tags";
import Field from "../../elements/Field";
import Input from "../../elements/Input";
import Subtitle from "../../elements/Subtitle";
import Button from "../../elements/Button";

const Container = styled(Flex)`
  background-color: white;
  padding: 1rem 1rem 0;
  width: 100%;
`;

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      laborCodeReferences: props.laborCodeReferences.map(
        laborCodeReference => ({
          value: laborCodeReference
        })
      ),
      selectedLaborCodeReferences: props.references
        .filter(({ category }) => category === "labor_code")
        .map(({ value }) => ({ value })),
      references: props.references
    };
  }

  addReference(event) {
    event.preventDefault();

    const value = this.$referenceTitle.value;
    if (value.trim().length === 0) return;

    if (find(propEq("value", value), this.state.references) !== undefined) {
      return;
    }

    const reference = {
      category: null,
      url: this.$referenceUrl.value,
      value
    };

    this.setState({
      references: [...this.state.references, reference]
    });

    this.props.onAdd(reference);
  }

  addLaborCodeReference({ value }) {
    const reference = {
      category: "labor_code",
      url: null,
      value
    };

    this.setState({
      references: [...this.state.references, reference]
    });

    this.props.onAdd(reference);
  }

  removeReference({ value: _value }) {
    this.setState({
      references: this.state.references.filter(({ value }) => value !== _value)
    });

    this.props.onRemove(_value);
  }

  removeLaborCodeReference({ value: _value }) {
    this.setState({
      references: this.state.references.filter(
        ({ category, value }) => value !== _value && category !== "labor_code"
      )
    });

    this.props.onRemove(_value);
  }

  render() {
    return (
      <Container flexDirection="column">
        <Subtitle isFirst>Articles du Code du travail:</Subtitle>
        <div>
          <Tags
            ariaName="la référence Code du Travail"
            isEditable
            onAdd={this.addLaborCodeReference.bind(this)}
            onRemove={this.removeLaborCodeReference.bind(this)}
            selectedTags={this.state.selectedLaborCodeReferences}
            tags={this.state.laborCodeReferences}
          />
        </div>

        <Subtitle>
          Autre (décret, règlementation, circulaire, jurisprudence):
        </Subtitle>
        <form onSubmit={this.addReference.bind(this)} role="form">
          <Field>
            <Input
              placeholder="Référence (ex: Décret n°82-447 du 28 mai 1982...)"
              ref={node => (this.$referenceTitle = node)}
            />
          </Field>
          <Field>
            <Input
              placeholder="URL (ex: https://www.legifrance.gouv.fr/...)"
              ref={node => (this.$referenceUrl = node)}
            />
          </Field>
          <Field>
            <Button title="Ajouter la référence juridique" type="submit">
              Ajouter
            </Button>
          </Field>
        </form>
        <Tags
          ariaName="la référence juridique"
          onRemove={this.removeReference.bind(this)}
          selectedTags={this.state.references.filter(
            ({ category }) => category === null
          )}
        />
      </Container>
    );
  }
}
