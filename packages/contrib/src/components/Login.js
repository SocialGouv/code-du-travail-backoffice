import customAxios from "../libs/customAxios";
import React from "react";
import { Button as ReButton } from "rebass";
import styled from "styled-components";

const Input = styled.input`
  border: solid 1px #d3d3d3;
  border-radius: 0.25rem;
  color: inherit;
  font-family: inherit;
  font-weight: inherit;
  font-size: 1rem;
  line-height: 1.25;
  margin: 0.5rem 0;
  padding: 0.5rem 0.75rem;
  width: 100%;

  ::placeholder {
    color: #bbbbbb;
    font-style: italic;
  }
`;

const Error = styled.p`
  color: red;
  font-weight: 600;
  height: 1rem;
`;

const Button = styled(ReButton)`
  background-color: #2978a0;
  border-radius: 0.25rem;
  cursor: pointer;
`;

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      error: null,
      isLoading: false
    };

    this.updateFormData = this.updateFormData.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.$email.focus();

    this.axios = customAxios();
  }

  componentDidUpdate() {
    this.$email.focus();
  }

  async login() {
    const res1 = await this.axios.post("/rpc/login", {
      email: this.state.email,
      password: "Azerty123"
    });
    const token = res1.data[0].token;
    const res2 = await this.axios.post("/rpc/login_check", { token });

    // Store JSON Web Token & user public data in session
    sessionStorage.setItem("jwt", token);
    sessionStorage.setItem("me", JSON.stringify(res2.data[0]));
  }

  updateFormData(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async submit(event) {
    if (event !== undefined) event.preventDefault();
    if (this.state.isLoading) return;

    this.setState({
      error: null,
      isLoading: true
    });

    if (this.state.email.length === 0) {
      this.setState({
        error: "Vous devez renseigner votre e-mail.",
        isLoading: false
      });

      return;
    }

    try {
      await this.login();
      this.props.onLog();
    } catch (e) {
      this.setState({
        error: "E-mail non reconnu.",
        isLoading: false
      });
    }
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <Input
          disabled={this.state.isLoading}
          name="email"
          onChange={this.updateFormData}
          placeholder="contributor@example.com"
          ref={ref => (this.$email = ref)}
        />
        <Error>{this.state.error}</Error>
        <Button disabled={this.state.isLoading} onClick={this.submit}>
          Se connecter
        </Button>
      </form>
    );
  }
}
