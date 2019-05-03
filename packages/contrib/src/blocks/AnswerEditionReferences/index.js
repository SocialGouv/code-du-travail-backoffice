import { find, propEq } from "ramda";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Tags from "../../components/Tags";
import Field from "../../elements/Field";
import Input from "../../elements/Input";
import Subtitle from "../../elements/Subtitle";
import Button from "../../elements/Button";
import List from "./List";

const Container = styled(Flex)`
  background-color: white;
  width: 100%;
`;
const Part = styled(Flex)`
  border: dashed 1px var(--color-light-steel-blue);
  margin: 0.5rem;
  padding: 0.5rem;
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

    const url = this.$referenceUrl.value;
    const reference = {
      category: null,
      url: url.trim().length !== 0 ? url : null,
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

  removeReference(value) {
    this.setState({
      references: this.state.references.filter(
        ({ value: _value }) => _value !== value
      )
    });

    this.props.onRemove(value);
  }

  removeLaborCodeReference(value) {
    this.setState({
      references: this.state.references.filter(
        ({ value: _value }) => _value !== value
      )
    });

    this.props.onRemove(value);
  }

  render() {
    const laborCodeReferences = this.state.references.filter(
      ({ category }) => category === "labor_code"
    );
    const otherReferences = this.state.references.filter(
      ({ category }) => category === null
    );

    return (
      <Container flexDirection="column">
        <Part>
          <Flex flexDirection="column" width={0.5}>
            <Subtitle isFirst>Articles du Code du travail:</Subtitle>
            <div>
              <Tags
                ariaName="la référence au Code du travail"
                hideTags
                isEditable
                onAdd={this.addLaborCodeReference.bind(this)}
                onRemove={this.removeLaborCodeReference.bind(this)}
                selectedTags={this.state.selectedLaborCodeReferences}
                tags={this.state.laborCodeReferences}
              />
            </div>
          </Flex>
          <List
            ariaName="la référence au Code du travail"
            onRemove={this.removeLaborCodeReference.bind(this)}
            references={laborCodeReferences}
            width={0.5}
          />
        </Part>
        <Part>
          <Flex flexDirection="column" width={0.5}>
            <Subtitle isFirst>
              Autre (décret, règlementation, circulaire, jurisprudence):
            </Subtitle>
            <form onSubmit={this.addReference.bind(this)} role="form">
              <Field>
                <Input
                  placeholder="Référence (ex: Décret n°82-447 du 28 mai 1982…)"
                  ref={node => (this.$referenceTitle = node)}
                />
              </Field>
              <Field>
                <Input
                  placeholder="URL (ex: https://www.legifrance.gouv.fr/…)"
                  ref={node => (this.$referenceUrl = node)}
                />
              </Field>
              <Field>
                <Button title="Ajouter la référence juridique" type="submit">
                  Ajouter
                </Button>
              </Field>
            </form>
          </Flex>
          <List
            ariaName="la référence juridique"
            onRemove={this.removeReference.bind(this)}
            references={otherReferences}
            width={0.5}
          />
        </Part>
      </Container>
    );
  }
}
