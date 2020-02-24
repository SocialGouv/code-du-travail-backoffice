import Router from "next/router";
import * as R from "ramda";
import React from "react";
import { Flex } from "rebass";

import Tags from "../../components/Tags";
import Button from "../../elements/Button";
import Field from "../../elements/Field";
import Input from "../../elements/Input";
import MarkdownEditor from "../../elements/MarkdownEditor";
import Select from "../../elements/Select";
import Textarea from "../../elements/Textarea";
import Title from "../../elements/Title";
import AdminMainLayout from "../../layouts/AdminMain";
import customAxios from "../../libs/customAxios";
import customPostgrester from "../../libs/customPostgrester";
import T from "../../texts";
import { Error, Form, HelpText, LabelContainer } from "./styles";

export default class AdminForm extends React.Component {
  constructor(props) {
    super(props);
    const { fields } = props;

    this.api = customPostgrester();
    this.defaultData = this.initDefaultData();

    this.state = {
      ...this.defaultData,
      error: null,
      inputKeys: [...fields]
        .filter(({ button }) => button !== undefined)
        .reduce((prev, { name }) => ({ ...prev, [name]: 0 }), {}),
      isLoading: true,
      isSubmitting: false,
    };

    this.renderField = this.renderField.bind(this);
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
    const { defaultData, fields } = this.props;

    const newDefaultData = defaultData !== undefined ? defaultData : {};

    return fields.reduce(
      (prev, { name, type }) => ({
        ...prev,
        [name]:
          newDefaultData[name] !== undefined ? newDefaultData[name] : type === "tags" ? [] : "",
      }),
      {},
    );
  }

  /**
   * Update the related data property value when an `input` or a `textarea` is changed.
   */
  updateFormData(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * Update the related data property value when a `markdown` is changed.
   */
  updateFormDataViaMarkdown(fieldName, value) {
    this.setState({ [fieldName]: value });
  }

  /**
   * Update the related data property value when a `select` is changed.
   */
  updateFormDataViaSelect(fieldName, value) {
    this.setState({ [fieldName]: value });
  }

  /**
   * Transform the related data property value via the handler function for the fields declared with
   * a custom `button` property, when this button is clicked.
   */
  programmaticallyUpdateFormData(field) {
    const currentFieldValue = this.state[field.name];
    const newFieldValue = field.button.handler(currentFieldValue);
    this.defaultData[field.name] = newFieldValue;

    this.setState({
      [field.name]: newFieldValue,
      // Force the related field to rebuild the component taking the new default value into account:
      inputKeys: {
        ...this.state.inputKeys,
        [field.name]: this.state.inputKeys[field.name] + 1,
      },
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
      [fieldName]: this.state[fieldName].filter(({ id }) => id !== _id),
    });
  }

  /**
   * Submit the data properties' value to the API, whether it's an insertion or an update.
   */
  async submit(event) {
    event.preventDefault();
    if (this.state.isSubmitting) return;
    this.setState({ error: null, isSubmitting: true });
    const { apiPath } = this.props;
    const isApiFunction = apiPath.startsWith("/rpc/");

    // Remove non-data properties from the state:
    const rawData = R.omit(["error", "inputKeys", "isLoading", "isSubmitting"], this.state);

    const selectFields = this.props.fields
      .filter(({ type }) => type === "select")
      .map(({ name }) => name);
    const tagFields = this.props.fields
      .filter(({ type }) => type === "tags")
      .map(({ name }) => name);

    const rawDataWithTags = R.pipe(
      R.toPairs,
      // Nullify select fields with an empty string value:
      R.map(([fieldName, value]) =>
        selectFields.includes(fieldName) && value === "" ? [fieldName, null] : [fieldName, value],
      ),
      // Clean tag fields by transforming their array of objects into an array of ids:
      R.map(([fieldName, value]) =>
        tagFields.includes(fieldName) ? [fieldName, value.map(({ id }) => id)] : [fieldName, value],
      ),
      R.fromPairs,
    )(rawData);

    // If it's an edition (= an id prop was provided) and we are calling a
    // custom PostgREST function, we need to insert the id of the edited item:
    const fullData =
      isApiFunction && this.props.id !== undefined
        ? { id: this.props.id, ...rawDataWithTags }
        : rawDataWithTags;

    const fieldsWithCustomApiPath = this.props.fields.filter(
      ({ apiPath }) => apiPath !== undefined,
    );

    // Remove the fields with a custom apiPath property from the main data:
    const data = R.omit(
      fieldsWithCustomApiPath.map(({ name }) => name),
      fullData,
    );

    // Most of the comments below are related to:
    // http://postgrest.org/en/latest/api.html#insertions-updates
    try {
      if (this.props.id !== undefined && !isApiFunction) {
        // PostgREST exposed api table updates are done via PATCH requests:
        const uri = `${this.props.apiPath}?id=eq.${this.props.id}`;
        await this.axios.patch(uri, data);

        if (fieldsWithCustomApiPath.length > 0) {
          const itemIdName = `${this.props.name.replace(/s$/, "")}_id`;

          for (const field of fieldsWithCustomApiPath) {
            // The easier and faster strategy to update the collection field is
            // to first delete all the foreign collection for the current item,
            // then re-create all the foreign collection from the current data:
            const uri = `${field.apiPath}?${itemIdName}=eq.${this.props.id}`;
            await this.axios.delete(uri);

            const { data: foreignData } = await this.api
              .orderBy("id", true)
              .page(0, 1)
              .get(field.apiPath);
            let foreignDataId = foreignData.length !== 0 ? foreignData[0].id : 0;

            const fieldIdName = `${field.name.replace(/s$/, "")}_id`;
            const newForeignData = fullData[field.name].map(foreignItemId => ({
              [fieldIdName]: foreignItemId,
              id: ++foreignDataId,
              [itemIdName]: this.props.id,
            }));

            await this.axios.post(field.apiPath, newForeignData);
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
          const itemIdName = `${this.props.name.replace(/s$/, "")}_id`;

          for (const field of fieldsWithCustomApiPath) {
            const { data: foreignData } = await this.api
              .orderBy("id", true)
              .page(0, 1)
              .get(field.apiPath);
            let foreignDataId = foreignData.length !== 0 ? foreignData[0].id : 0;

            const fieldIdName = `${field.name.replace(/s$/, "")}_id`;
            const newForeignData = fullData[field.name].map(foreignItemId => ({
              [fieldIdName]: foreignItemId,
              id: ++foreignDataId,
              [itemIdName]: itemId,
            }));

            await this.axios.post(field.apiPath, newForeignData);
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
          isSubmitting: false,
        });
      } else {
        this.setState({ isSubmitting: false });
        if (err !== undefined) console.warn(err);
      }
    }
  }

  /**
   * Render an input.
   */
  renderInput(field, key) {
    switch (field.type) {
      case "input":
        return (
          <Input
            defaultValue={this.defaultData[field.name]}
            id={field.name}
            key={key !== undefined ? key : 0}
            name={field.name}
            onChange={this.updateFormData}
            readOnly={field.isReadOnly === undefined ? false : field.isReadOnly}
            type={field.inputType === undefined ? "text" : field.inputType}
          />
        );

      case "markdown":
        return (
          <MarkdownEditor
            defaultValue={this.defaultData[field.name]}
            // isSingleView
            onChange={({ source }) => this.updateFormDataViaMarkdown(field.name, source)}
            singleViewDefault="editor"
          />
        );

      case "select":
        return (
          <Select
            defaultValue={field.options.find(({ value }) => value === this.defaultData[field.name])}
            id={field.name}
            name={field.name}
            onChange={({ value }) => this.updateFormDataViaSelect(field.name, value)}
            options={field.options}
          />
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
            rows="10"
          />
        );
    }
  }

  /**
   * Render a field.
   */
  renderField(field) {
    const labelId = `label_${field.name}`;

    return (
      <Field key={field.name}>
        <LabelContainer>
          <label htmlFor={field.name} id={labelId}>
            {field.label} :
          </label>
          {field.helpText !== undefined && <HelpText>{field.helpText}</HelpText>}
        </LabelContainer>

        {/* Link input to the button "click" event if there is one: */}
        {field.button !== undefined ? (
          <Flex style={{ flexGrow: 1 }}>
            {this.renderInput(field, this.state.inputKeys[field.name])}
            <Button
              icon={field.button.icon}
              onClick={() => this.programmaticallyUpdateFormData(field)}
              title={field.button.title}
              type="button"
            />
          </Flex>
        ) : (
          this.renderInput(field)
        )}
      </Field>
    );
  }

  /**
   * TODO Find a better way to guess the name.
   */
  guessName() {
    const { id } = this.props;
    const { index, name, question, title } = this.defaultData;

    return name || title || question || index || id;
  }

  render() {
    const {
      fields,
      i18nIsFeminine = false,
      i18nSubject = "MISSING_SUBJECT",
      id,
      indexPath,
    } = this.props;
    const { error, isLoading, isSubmitting } = this.state;

    if (isLoading) return <AdminMainLayout isLoading />;

    const i18nName = this.guessName();
    const isEdition = id !== undefined;

    return (
      <AdminMainLayout>
        <Form flexDirection="row" onSubmit={this.submit} role="form">
          <Title isFirst>
            {isEdition
              ? T.ADMIN_COMMON_FORM_EDIT_TITLE(i18nSubject, i18nIsFeminine, i18nName)
              : T.ADMIN_COMMON_FORM_NEW_TITLE(i18nSubject, i18nIsFeminine)}
          </Title>
          {fields.map(this.renderField)}
          <Field>
            <LabelContainer />
            <div>
              <Error>{error}</Error>
              <Flex>
                <Button
                  color="secondary"
                  disabled={isSubmitting}
                  hasGroup
                  onClick={() => Router.push(`/admin${indexPath}`)}
                  title={T.ADMIN_COMMON_BUTTON_CANCEL_FORM_TITLE(i18nSubject)}
                  type="button"
                >
                  Annuler
                </Button>
                <Button
                  disabled={isSubmitting}
                  title={
                    isEdition
                      ? T.ADMIN_COMMON_BUTTON_UPDATE_TITLE(i18nSubject, i18nIsFeminine, i18nName)
                      : T.ADMIN_COMMON_BUTTON_CREATE_TITLE(i18nSubject, i18nIsFeminine)
                  }
                  type="submit"
                >
                  {isEdition ? "Mettre à jour" : "Créer"}
                </Button>
              </Flex>
            </div>
          </Field>
        </Form>
      </AdminMainLayout>
    );
  }
}