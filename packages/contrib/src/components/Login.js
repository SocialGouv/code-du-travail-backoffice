import customAxios from "../libs/customAxios";
import React from "react";
import { Button as ReButton, Flex } from "rebass";
import styled from "styled-components";

const Field = styled(Flex)`
  margin-bottom: 0.5rem;
`;
const Input = styled.input`
  border: solid 1px ${props => (Boolean(props.hasError) ? "red" : "#d3d3d3")};
  border-radius: 0.25rem;
  color: inherit;
  font-family: inherit;
  font-weight: inherit;
  font-size: 1rem;
  line-height: 1.25;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.1rem;
  width: 100%;

  ::placeholder {
    color: #bbbbbb;
    font-style: italic;
  }
`;
const Error = styled.div`
  color: red;
  font-size: 0.75rem;
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
      emailError: null,
      isLoading: false,
      password: "",
      passwordError: null
    };

    this.updateFormData = this.updateFormData.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.$email.focus();

    this.axios = customAxios();
  }

  componentDidUpdate() {
    if (this.state.emailError !== null) this.$email.focus();
    if (this.state.passwordError !== null) this.$password.focus();
  }

  async login() {
    const res1 = await this.axios.post("/rpc/login", {
      email: this.state.email,
      password: this.state.password
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
      emailError: null,
      isLoading: true,
      passwordError: null
    });

    if (this.state.email.length === 0) {
      this.setState({
        emailError: "Vous devez renseigner votre e-mail.",
        isLoading: false
      });

      return;
    }

    if (this.state.password.length === 0) {
      this.setState({
        passwordError: "Vous devez renseigner votre mot de passe.",
        isLoading: false
      });

      return;
    }

    try {
      await this.login();
      this.props.onLog();
    } catch (e) {
      this.setState({
        passwordError: "E-mail et/ou mot de passe non reconnu(s).",
        isLoading: false
      });
    }
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <Field flexDirection="column">
          <Input
            disabled={this.state.isLoading}
            hasError={this.state.emailError !== null}
            name="email"
            onChange={this.updateFormData}
            placeholder="E-mail"
            ref={ref => (this.$email = ref)}
            type="email"
          />
          <Error>{this.state.emailError}</Error>
        </Field>
        <Field flexDirection="column">
          <Input
            disabled={this.state.isLoading}
            hasError={this.state.passwordError !== null}
            name="password"
            onChange={this.updateFormData}
            placeholder="Mot de passe"
            ref={ref => (this.$password = ref)}
            type="password"
          />
          <Error>{this.state.passwordError}</Error>
        </Field>
        <Button disabled={this.state.isLoading} onClick={this.submit}>
          Se connecter
        </Button>
      </form>
    );
  }
}
