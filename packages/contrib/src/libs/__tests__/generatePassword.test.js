import zxcvbn from "zxcvbn";

import generatePassword from "../generatePassword";

describe("lib/generatePassword()", () => {
  it("should generate a very unguessable 16 characters password", () => {
    const password = generatePassword(16);

    expect(password.length).toBe(16);
    // https://github.com/dropbox/zxcvbn#usage
    expect(zxcvbn(password).score).toBe(4);
  });

  it("should generate a very unguessable 32 characters password", () => {
    const password = generatePassword(32);

    expect(password.length).toBe(32);
    // https://github.com/dropbox/zxcvbn#usage
    expect(zxcvbn(password).score).toBe(4);
  });
});
