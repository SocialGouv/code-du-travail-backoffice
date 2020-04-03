import catchError from "../catchError";

const DATA = { some: "data" };
const MESSAGE = "An error message.";
const PATH = "a/path()";

describe("helpers/catchError()", () => {
  it("should return the expected {Error} with a {string} <errorOrMessage>", () => {
    const expectedMessage = "a/path(): An error message.";

    const received = catchError(PATH, MESSAGE);
    expect(received).toBeInstanceOf(Error);
    expect(received.data).toBeUndefined();
    expect(received.message).toStrictEqual(expectedMessage);
  });

  it("should return the expected {Error} with an {Error} <errorOrMessage>", () => {
    const expectedMessage = "a/path(): An error message.";

    const received = catchError(PATH, new Error(MESSAGE));
    expect(received).toBeInstanceOf(Error);
    expect(received.data).toBeUndefined();
    expect(received.message).toStrictEqual(expectedMessage);
  });

  it("should return the expected {Error} with a defined <data>", () => {
    const expectedMessage = "a/path(): An error message.";

    const received = catchError(PATH, MESSAGE, DATA);
    expect(received).toBeInstanceOf(Error);
    expect(received.data).toStrictEqual(DATA);
    expect(received.message).toStrictEqual(expectedMessage);
  });
});
