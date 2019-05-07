import React from "react";
import { fireEvent, render } from "react-testing-library";

import "../../../__mocks__/waitFor";

import Login from "../Login";

describe("[Contrib] components/<Login />", () => {
  const email = "contributor@example.com";
  const password = "Azerty123";
  const token = "aFakeToken";
  const name = "A Name";
  const location = "A Location";

  const onLog = jest.fn();
  const { container, getByPlaceholderText, getByRole, queryByText } = render(
    <Login onLog={onLog} />
  );
  const $form = getByRole(/form/);
  const $emailInput = getByPlaceholderText(/E-mail/);
  const $passwordInput = getByPlaceholderText(/Mot de passe/);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should not call login() twice", async () => {
    const axiosPostCallsLength = global.axios.post.mock.calls.length;
    global.axios.post.mockRejectedValueOnce();

    fireEvent.input($emailInput, { target: { value: email } });
    fireEvent.input($passwordInput, { target: { value: password } });
    fireEvent.submit($form);
    fireEvent.submit($form);
    await waitFor(0);

    expect(global.axios.post.mock.calls.length - axiosPostCallsLength).toBe(1);
  });

  it("should show the expected email error", () => {
    fireEvent.input($emailInput, { target: { value: "" } });
    fireEvent.input($passwordInput, { target: { value: "" } });
    fireEvent.submit($form);

    expect(
      queryByText(/Vous devez renseigner votre e-mail./)
    ).toBeInTheDocument();
  });

  it("should show the expected password error", () => {
    fireEvent.input($emailInput, { target: { value: email } });
    fireEvent.submit($form);

    expect(
      queryByText(/Vous devez renseigner votre mot de passe./)
    ).toBeInTheDocument();
  });

  it("should show the expected login error", async () => {
    global.axios.post.mockRejectedValueOnce();

    fireEvent.input($passwordInput, { target: { value: password } });
    fireEvent.submit($form);
    await waitFor(0);

    expect(global.axios.post).toHaveBeenCalledWith("/rpc/login", { email, password });
    expect(
      queryByText(/E-mail et\/ou mot de passe non reconnu\(s\)\./)
    ).toBeInTheDocument();
  });

  it("should show the expected login error", async () => {
    global.axios.post.mockResolvedValueOnce({ data: [{ token }] });
    global.axios.post.mockRejectedValueOnce();

    fireEvent.submit($form);
    await waitFor(0);

    expect(global.axios.post).toHaveBeenCalledWith("/rpc/login", { email, password });
    expect(global.axios.post).toHaveBeenCalledWith("/rpc/login_check", { token });
    expect(
      queryByText(/E-mail et\/ou mot de passe non reconnu\(s\)./)
    ).toBeInTheDocument();
  });

  it("should login", async () => {
    global.axios.post.mockResolvedValueOnce({ data: [{ token }] });
    global.axios.post.mockResolvedValueOnce({ data: [{ name, location }] });

    fireEvent.submit($form);
    await waitFor(0);

    expect(global.axios.post).toHaveBeenCalledWith("/rpc/login", { email, password });
    expect(global.axios.post).toHaveBeenCalledWith("/rpc/login_check", { token });
    expect(sessionStorage.getItem("jwt")).toBe(token);
    expect(sessionStorage.getItem("me")).toBe(
      JSON.stringify({ name, location })
    );
  });
});
