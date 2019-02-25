import axios from "axios";
import React from "react";
import { Button as ReButton } from "rebass";
import styled from "styled-components";

import Main from "../../../src/layouts/Main";

const Form = styled.form`
  /* box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-grow: 1; */
`;

const Textarea = styled.textarea`
  background-color: #315659;
  border: 0;
  color: #ffffff;
  flex-grow: 1;
  font-family: inherit;
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.5;
  padding: 0.45rem 0.9rem;
`;

const Button = styled(ReButton)`
  background-color: #2978a0;
  border-radius: 0;
  cursor: pointer;
`;

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };

    this.updateValue = this.updateValue.bind(this);
  }

  updateValue(event) {
    this.setState({ value: event.target.value });
  }

  save() {
    const uri = `http://localhost:3200/answers?id=eq.${this.props.id}`;
    const data = {
      value: this.value
    };
    const config = {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("jwt")}` }
    };

    axios.patch(uri, data, config).catch(console.warn);
  }

  render() {
    return (
      <Main>
        <Form flexDirection="row" onSubmit={() => void 0}>
          <Textarea onChange={this.updateValue} />
          <Button>Créer une nouvelle question</Button>
        </Form>
      </Main>
    );
  }
}
