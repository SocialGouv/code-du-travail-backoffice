import React from "react";
import { Button as ReButton, Flex } from "rebass";
import styled from "styled-components";

import Main from "../src/layouts/main";

const Form = styled.form`
  margin: 1rem;
`;

const Input = styled.input`
  border: 0;
  color: inherit;
  font-family: inherit;
  font-weight: inherit;
  font-size: 1.2rem;
  line-height: 1.25;
  margin: 0.5rem 0;
  padding: 0.25rem 0.5rem;
  width: 100%;
`;

const Select = styled.select`
  border: 0;
  color: inherit;
  font-family: inherit;
  font-weight: inherit;
  font-size: 1.2rem;
  line-height: 1.25;
  margin: 0.5rem 0;
  padding: 0.25rem 0.5rem;
  width: 100%;
`;

const Button = styled(ReButton)`
  background-color: #2978a0;
  border-radius: 0;
  cursor: pointer;
  margin-top: 1rem;
`;

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      location: ""
    };

    this.updateFormData = this.updateFormData.bind(this);
    this.startNewAnswer = this.startNewAnswer.bind(this);
  }

  updateFormData(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  startNewAnswer(event) {
    if (event !== undefined) event.preventDefault();
  }

  render() {
    return (
      <Main>
        <Flex style={{ flexGrow: 1 }}>
          <Flex width={1 / 2} />
          <Flex
            flexDirection="column"
            justifyContent="center"
            width={1 / 2}
            style={{ flexGrow: 1 }}
          >
            <Form onSubmit={this.startNewAnswer}>
              <Input
                onChange={this.updateFormData}
                name="email"
                placeholder="E-mail"
              />
              <Select onChange={this.updateFormData} name="location">
                <option value="" />
                <option value="fcfa979c-4025-40c3-ad7b-a22640f78235">
                  Centre A
                </option>
              </Select>
              <Button onClick={this.startNewAnswer}>
                Rédiger un nouvelle réponse
              </Button>
            </Form>
          </Flex>
        </Flex>
      </Main>
    );
  }
}
