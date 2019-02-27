import axios from "axios";
import React from "react";
import { fireEvent, render } from "react-testing-library";
import Login from "../Login";

jest.mock("axios");

const waitFor = async t => new Promise(r => setTimeout(r, t));

describe("[Contrib] components/<Login />", () => {
  const onLog = jest.fn();
  const { container } = render(<Login onLog={onLog} />);
  const $button = container.querySelector("button");
  const $error = container.querySelector("p");
  const $form = container.querySelector("form");
  const $input = container.querySelector("input");

  const token = "aFakeJWT";
  const res = { data: [{ token }] };
  axios.post.mockRejectedValueOnce(new Error());
  axios.post.mockResolvedValueOnce(res);

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  describe("when submitting the form", () => {
    it("should show the expected error with an empty email input", () => {
      fireEvent.submit($form);

      expect($error.innerHTML).toBe("Vous devez renseigner votre e-mail.");
    });

    it("should show the expected error with an wrong email", async () => {
      fireEvent.change($input, { target: { value: "ko@example.com" } });
      fireEvent.click($button);

      expect(axios.post).toHaveBeenCalledTimes(1);
      await waitFor(0);
      expect($error.innerHTML).toBe("E-mail non reconnu.");
    });

    it("should not show any error with a registered email", async () => {
      fireEvent.change($input, { target: { value: "ok@example.com" } });
      fireEvent.click($button);

      expect(axios.post).toHaveBeenCalledTimes(2);
      await waitFor(0);
      expect($error.innerHTML).toBe("");
    });

    it("should have called onLog() prop once", () => {
      expect(onLog.mock.calls.length).toBe(1);
    });
  });
});
