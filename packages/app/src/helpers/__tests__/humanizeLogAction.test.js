import humanizeLogAction from "../humanizeLogAction";

describe("helpers/humanizeLogAction()", () => {
  it("should return the expected action a connection", () => {
    expect(humanizeLogAction("post", "/rpc/login")).toStrictEqual("Connexion");
  });

  it("should return the expected action an authentication", () => {
    expect(humanizeLogAction("post", "/rpc/login_check")).toStrictEqual("Authentification");
  });

  it("should return the expected action a deletion", () => {
    expect(humanizeLogAction("delete", "/a-path")).toStrictEqual("Suppression");
  });

  it("should return the expected action a modification", () => {
    expect(humanizeLogAction("patch", "/a-path")).toStrictEqual("Modification");
  });

  it("should return the expected action an insertion", () => {
    expect(humanizeLogAction("post", "/a-path")).toStrictEqual("Insertion");
  });

  it("should return `null` for an unknown method", () => {
    expect(humanizeLogAction("", "/a-path")).toStrictEqual("N/A");
  });
});
