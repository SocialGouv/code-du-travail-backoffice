import styled from "@emotion/styled";
import { find, propEq } from "ramda";
import React from "react";
import { Flex } from "rebass";

import Tags from "../../components/Tags";
import Button from "../../elements/Button";
import Field from "../../elements/Field";
import Input from "../../elements/Input";
import Subtitle from "../../elements/Subtitle";
import AnswerEditionReferencesBlockList from "./List";

const Container = styled(Flex)`
  flex-grow: 1;
`;
const Part = styled(Flex)`
  border-bottom: dashed 1px var(--color-light-steel-blue);
  margin: 0.5rem;
  padding: 0.5rem;
`;

export default class AnswerEditionReferencesBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      agreementReferenceFormKey: 0,
      laborCodeReferences: props.laborCodeReferences.map(laborCodeReference => ({
        value: laborCodeReference
      })),
      referenceFormKey: 0,
      references: props.references,
      selectedLaborCodeReferences: props.references
        .filter(({ category }) => category === "labor_code")
        .map(({ value }) => ({ value }))
    };
  }

  addLaborCodeReference({ value }) {
    const reference = {
      category: "labor_code",
      url: null,
      value: value.trim()
    };

    this.setState({
      references: [...this.state.references, reference]
    });

    this.props.onAdd(reference);
  }

  removeLaborCodeReference(value) {
    this.setState({
      references: this.state.references.filter(({ value: _value }) => _value !== value)
    });

    this.props.onRemove(value);
  }

  addAgreementReference(event) {
    event.preventDefault();

    const value = this.$agreementReferenceTitle.value.trim();
    const url = this.$agreementReferenceUrl.value.trim();
    if (value.trim().length === 0) return;

    if (find(propEq("value", value), this.state.references) !== undefined) {
      return;
    }

    const reference = {
      category: "agreement",
      url: url.length !== 0 ? url : null,
      value
    };

    this.setState({
      agreementReferenceFormKey: this.state.agreementReferenceFormKey + 1,
      references: [...this.state.references, reference]
    });

    this.props.onAdd(reference);
  }

  removeAgreementReference(value) {
    this.setState({
      references: this.state.references.filter(({ value: _value }) => _value !== value)
    });

    this.props.onRemove(value);
  }

  addReference(event) {
    event.preventDefault();

    const value = this.$referenceTitle.value;
    if (value.trim().length === 0) return;

    if (find(propEq("value", value), this.state.references) !== undefined) {
      return;
    }

    const url = this.$referenceUrl.value.trim();
    const reference = {
      category: null,
      url: url.trim().length !== 0 ? url : null,
      value
    };

    this.setState({
      referenceFormKey: this.state.referenceFormKey + 1,
      references: [...this.state.references, reference]
    });

    this.props.onAdd(reference);
  }

  removeReference(value) {
    this.setState({
      references: this.state.references.filter(({ value: _value }) => _value !== value)
    });

    this.props.onRemove(value);
  }

  render() {
    const agreementReferences = this.state.references.filter(
      ({ category }) => category === "agreement"
    );
    const laborCodeReferences = this.state.references.filter(
      ({ category }) => category === "labor_code"
    );
    const otherReferences = this.state.references.filter(({ category }) => category === null);

    return (
      <Container flexDirection="column">
        <Part>
          <Flex flexDirection="column" width={0.5}>
            <Subtitle isFirst>Articles de convention collective :</Subtitle>
            <form
              key={this.state.agreementReferenceFormKey}
              onSubmit={this.addAgreementReference.bind(this)}
            >
              <Field>
                <Input
                  placeholder="Ex: Article 7, Texte sur les salaires de 1984…"
                  ref={node => (this.$agreementReferenceTitle = node)}
                />
              </Field>
              <Field>
                <Input
                  placeholder="URL (ex: https://www.legifrance.gouv.fr/…)"
                  ref={node => (this.$agreementReferenceUrl = node)}
                />
              </Field>
              <Field>
                <Button title="Ajouter la référence à la convention collective" type="submit">
                  Ajouter la référence Convention Collective
                </Button>
              </Field>
            </form>
          </Flex>
          <AnswerEditionReferencesBlockList
            ariaName="la référence à la convention collective"
            onRemove={this.removeAgreementReference.bind(this)}
            references={agreementReferences}
            width={0.5}
          />
        </Part>
        <Part>
          <Flex flexDirection="column" width={0.5}>
            <Subtitle isFirst>Articles du Code du travail :</Subtitle>
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
          <AnswerEditionReferencesBlockList
            ariaName="la référence au Code du travail"
            onRemove={this.removeLaborCodeReference.bind(this)}
            references={laborCodeReferences}
            width={0.5}
          />
        </Part>
        <Part>
          <Flex flexDirection="column" width={0.5}>
            <Subtitle isFirst>
              Autre référence juridique (décret, règlementation, circulaire, jurisprudence) :
            </Subtitle>
            <form key={this.state.referenceFormKey} onSubmit={this.addReference.bind(this)}>
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
                  Ajouter la référence juridique
                </Button>
              </Field>
            </form>
          </Flex>
          <AnswerEditionReferencesBlockList
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
