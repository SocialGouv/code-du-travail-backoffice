/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import Router from "next/router";
import * as R from "ramda";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Tags from "../components/Tags";
import Button from "../elements/Button";
import Field from "../elements/Field";
import Input from "../elements/Input";
import Select from "../elements/Select";
import Textarea from "../elements/Textarea";
import Title from "../elements/Title";
import AdminMain from "../layouts/AdminMain";
import customAxios from "../libs/customAxios";
import unspace from "../libs/unspace";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 1rem;
`;
const Label = styled.label`
  color: var(--color-black-leather-jacket);
  line-height: 1;
  min-width: 10rem;
  padding: 0.65rem 0 0;
  width: 10rem;
`;
const Error = styled.div`
  color: red;
  font-weight: 600;
  height: 1.5rem;
`;

export default class AdminForm extends React.Component {
  constructor(props) {
    super(props);

    this.defaultData = this.initDefaultData();

    this.state = {
      ...this.defaultData,
      error: null,
      inputKeys: this.props.fields
        .filter(({ button }) => button !== undefined)
        .reduce((prev, { name }) => ({ ...prev, [name]: 0 }), {}),
      isLoading: true,
      isSubmitting: false
    };

    this.getField = this.getField.bind(this);
    this.submit = this.submit.bind(this);
    this.updateFormData = this.updateFormData.bind(this);
  }

  componentDidMount() {
    this.axios = customAxios();

    this.setState({ isLoading: false });
  }

  /**
   * Initialize default data missing properties with coherently typed values.
   */
  initDefaultData() {
    const defaultData =
      this.props.defaultData !== undefined ? this.props.defaultData : {};

    return this.props.fields.reduce(
      (prev, { name, type }) => ({
        ...prev,
        [name]:
          defaultData[name] !== undefined
            ? defaultData[name]
            : type === "tags"
            ? []
            : ""
      }),
      {}
    );
  }

  /**
   * Update the related data property value when an `input`, `select` or
   * `textarea` is changed.
   */
  updateFormData(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * Transform the related data property value via the handler function for the
   * fields declared with a custom `button` property, when this button is
   * clicked.
   */
  programmaticallyUpdateFormData(field) {
    const currentFieldValue = this.state[field.name];
    const newFieldValue = field.button.handler(currentFieldValue);
    this.defaultData[field.name] = newFieldValue;

    this.setState({
      [field.name]: newFieldValue,
      // Force the related field to rebuild the component taking the new default
      // value into account:
      inputKeys: {
        ...this.state.inputKeys,
        [field.name]: this.state.inputKeys[field.name] + 1
      }
    });
  }

  /**
   * Handle the tag addition for the `tags` type fields.
   */
  addTag(fieldName, { id, value }) {
    this.setState({ [fieldName]: [...this.state[fieldName], { id, value }] });
  }

  /**
   * Handle the tag removal for the `tags` type fields.
   */
  removeTag(fieldName, { id: _id }) {
    this.setState({
      [fieldName]: this.state[fieldName].filter(({ id }) => id !== _id)
    });
  }

  /**
   * Submit the data properties' value to the API, whether it's an insertion or
   * an update.
   */
  async submit(event) {
    event.preventDefault();
    if (this.state.isSubmitting) return;

    this.setState({
      error: null,
      isSubmitting: true
    });

    // We need to remove the non-data properties from the state:
    const rawData = R.omit(
      ["error", "inputKeys", "isLoading", "isSubmitting"],
      this.state
    );

    // We need to clean the tag fields by transforming their array of objects
    // into an array of ids:
    const tagFields = this.props.fields
      .filter(({ type }) => type === "tags")
      .map(({ name }) => name);
    const rawDataWithTags = R.compose(
      R.fromPairs,
      R.map(([fieldName, value]) =>
        tagFields.includes(fieldName)
          ? [fieldName, value.map(({ id }) => id)]
          : [fieldName, value]
      ),
      R.toPairs
    )(rawData);

    // If it's an edition (= an id prop was provided) and we are calling a
    // custom PostgREST function, we need to insert the id of the edited item:
    const fullData =
      Boolean(this.props.isApiFunction) && this.props.id !== undefined
        ? { id: this.props.id, ...rawDataWithTags }
        : rawDataWithTags;

    const fieldsWithCustomApiPath = this.props.fields.filter(
      ({ apiPath }) => apiPath !== undefined
    );

    // Remove the fields with a custom apiPath property from the main data:
    const data = R.omit(
      fieldsWithCustomApiPath.map(({ name }) => name),
      fullData
    );

    // Most of the comments below are related to:
    // http://postgrest.org/en/v5.2/api.html#insertions-updates
    try {
      if (this.props.id !== undefined && !Boolean(this.props.isApiFunction)) {
        // PostgREST exposed api table updates are done via PATCH requests:
        const uri = `${this.props.apiPath}?id=eq.${this.props.id}`;
        await this.axios.patch(uri, data);

        if (fieldsWithCustomApiPath.length > 0) {
          const itemIdName = `${this.props.name}_id`;

          for (let field of fieldsWithCustomApiPath) {
            const fieldIdName = `${field.singleName}_id`;
            const foreignData = fullData[field.name].map(foreignItemId => ({
              [itemIdName]: this.props.id,
              [fieldIdName]: foreignItemId
            }));

            // The easier and faster strategy to update the collection field is
            // to first delete all the foreign collection for the current item,
            // then re-create all the foreign collection from the current data:
            const uri = `${field.apiPath}?${itemIdName}=eq.${this.props.id}`;
            await this.axios.delete(uri);
            await this.axios.post(field.apiPath, foreignData);
          }
        }
      } else {
        // PostgREST exposed api table insertons as well as exposed custom (rpc)
        // functions calls are done via POST requests:
        const { headers } = await this.axios.post(this.props.apiPath, data);

        if (fieldsWithCustomApiPath.length > 0) {
          // The PostgREST response includes a Location header describing where
          // to find the inserted item:
          const itemId = /[0-9a-f-]+$/.exec(headers.location)[0];
          const itemIdName = `${this.props.name}_id`;

          for (let field of fieldsWithCustomApiPath) {
            const fieldIdName = `${field.singleName}_id`;
            const foreignData = fullData[field.name].map(foreignItemId => ({
              [itemIdName]: itemId,
              [fieldIdName]: foreignItemId
            }));
            await this.axios.post(field.apiPath, foreignData);
          }
        }
      }

      Router.push(`/admin${this.props.indexPath}`);
    } catch (err) {
      if (
        err !== undefined &&
        err.response !== undefined &&
        err.response.data !== undefined &&
        typeof err.response.data.message === "string"
      ) {
        this.setState({
          error: `Erreur: ${err.response.data.message}.`,
          isSubmitting: false
        });
      } else {
        this.setState({ isSubmitting: false });
        if (err !== undefined) console.warn(err);
      }
    }
  }

  /**
   * Get the input-like element depending on the field type.
   */
  getInput(field, key) {
    switch (field.type) {
      case "input":
        return (
          <Input
            defaultValue={this.defaultData[field.name]}
            id={field.name}
            key={key !== undefined ? key : 0}
            name={field.name}
            onChange={this.updateFormData}
            type={field.inputType === undefined ? "text" : field.inputType}
          />
        );

      case "select":
        return (
          <Select
            defaultValue={this.defaultData[field.name]}
            id={field.name}
            name={field.name}
            onChange={this.updateFormData}
          >
            <option />
            {field.options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.name}
              </option>
            ))}
          </Select>
        );

      case "tags":
        return (
          <Tags
            aria-labelledby={`label_${field.name}`}
            ariaName={field.ariaName}
            isEditable
            onAdd={tag => this.addTag(field.name, tag)}
            onRemove={tag => this.removeTag(field.name, tag)}
            selectedTags={this.defaultData[field.name]}
            tags={field.tags}
          />
        );

      case "text":
        return (
          <Textarea
            defaultValue={this.defaultData[field.name]}
            id={field.name}
            name={field.name}
            onChange={this.updateFormData}
            rows="20"
          />
        );
    }
  }

  /**
   * Get the complete field (label & input-like) elements depending of the field
   * type and customizations.
   */
  getField(field) {
    const labelId = `label_${field.name}`;

    if (field.button === undefined)
      return (
        <Field key={field.name}>
          <Label htmlFor={field.name} id={labelId}>
            {field.label}
          </Label>
          {this.getInput(field)}
        </Field>
      );

    return (
      <Field key={field.name}>
        <Label htmlFor={field.name} id={labelId}>
          {field.label}
        </Label>
        <Flex style={{ flexGrow: 1 }}>
          {this.getInput(field, this.state.inputKeys[field.name])}
          <Button
            icon={field.button.icon}
            onClick={() => this.programmaticallyUpdateFormData(field)}
            title={field.button.ariaLabel}
            type="button"
          />
        </Flex>
      </Field>
    );
  }

  render() {
    if (this.state.isLoading) return <AdminMain isLoading />;

    return (
      <AdminMain>
        <Form flexDirection="row" onSubmit={this.submit} role="form">
          <Title isFirst>{this.props.title}</Title>
          {this.props.fields.map(this.getField)}
          <Field>
            <Label />
            <div>
              <Error>{this.state.error}</Error>
              <Flex>
                <Button
                  color="secondary"
                  disabled={this.state.isSubmitting}
                  hasGroup
                  onClick={() => Router.push(`/admin${this.props.indexPath}`)}
                  title={unspace(this.props.ariaLabels.cancelButton)}
                  type="button"
                >
                  Annuler
                </Button>
                <Button
                  disabled={this.state.isSubmitting}
                  title={unspace(this.props.ariaLabels.createOrEditButton)}
                  type="submit"
                >
                  {this.props.id !== undefined ? "Mettre à jour" : "Créer"}
                </Button>
              </Flex>
            </div>
          </Field>
        </Form>
      </AdminMain>
    );
  }
}
