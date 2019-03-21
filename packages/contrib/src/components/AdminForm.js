/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import Router from "next/router";
import { omit } from "ramda";
import React from "react";
import { Button as ReButton, Flex } from "rebass";
import styled from "styled-components";

import Title from "../elements/Title";
import AdminMain from "../layouts/AdminMain";
import customAxios from "../libs/customAxios";

import "../../node_modules/react-table/react-table.css";

const Form = styled.form`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 1rem;
`;

const Field = styled(Flex)`
  margin-bottom: 0.5rem;
`;
const Label = styled.div`
  color: gray;
  line-height: 1;
  max-width: 10rem;
  padding: 0.65rem 0 0;
  width: 10rem;
`;

const Input = styled.input`
  -webkit-appearance: none;
  background-color: transparent;
  border: solid 1px lightgray;
  color: black;
  flex-grow: 1;
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  height: 2rem;
  line-height: 1;
  padding: 0.4rem 0.6rem 0.575rem;
`;

const Select = styled.select`
  -webkit-appearance: none;
  background-color: transparent;
  border: solid 1px lightgray;
  border-radius: 0;
  color: black;
  flex-grow: 1;
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  height: 2rem;
  line-height: 1;
  padding: 0.4rem 0.6rem 0.575rem;
`;

const Error = styled.div`
  color: red;
  font-weight: 600;
  height: 1.5rem;
  margin-left: 10rem;
`;

const Button = styled(ReButton)`
  background-color: #2978a0;
  border-radius: 0;
  cursor: pointer;
  margin-left: 10rem;
  width: 5rem;
`;

export default class AdminForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.props.data,
      error: null,
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

  updateFormData(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async submit() {
    if (event !== undefined) event.preventDefault();
    if (this.state.isSubmitting) return;

    this.setState({
      error: null,
      isSubmitting: true
    });

    const data = omit(["error", "isLoading", "isSubmitting"], this.state);

    try {
      await this.axios.post(this.props.apiPath, data);
      Router.push(`/admin${this.props.indexPath}`);
    } catch (err) {
      if (
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

  getField(field) {
    switch (field.type) {
      case "input":
        return (
          <Field key={field.name}>
            <Label>Intitulé:</Label>
            <Input
              name={field.name}
              onChange={this.updateFormData}
              defaultValue={field.default}
            />
          </Field>
        );

      case "select":
        return (
          <Field key={field.name}>
            <Label>{field.label}:</Label>
            <Select name={field.name} onChange={this.updateFormData}>
              <option />
              {field.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.name}
                </option>
              ))}
            </Select>
          </Field>
        );
    }
  }

  render() {
    if (this.state.isLoading) return <AdminMain isLoading />;

    return (
      <AdminMain>
        <Form flexDirection="row" onSubmit={this.submit}>
          <Title isFirst>{this.props.title}</Title>
          {this.props.fields.map(this.getField)}
          <Error>{this.state.error}</Error>
          <Button disabled={this.state.isSubmitting} onClick={this.submit}>
            Créer
          </Button>
        </Form>
      </AdminMain>
    );
  }
}
