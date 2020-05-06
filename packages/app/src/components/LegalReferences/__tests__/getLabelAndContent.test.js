jest.mock("../../../libs/api");

import api from "../../../libs/api";
import getLabelAndContent from "../getLabelAndContent";

describe("components/LegalReferences/getLabelAndContent()", () => {
  it(`should return the expected label, content (unlinked, non-empty <value>)`, async () => {
    const [label, content] = await getLabelAndContent("A value", null);

    expect(label).toStrictEqual(`A value`);
    expect(content).toBeNull();
  });

  it(`should return the expected label, content (linked, non-empty <value>)`, async () => {
    const apiResponse = {
      content: "A content",
      index: "1.2.3",
      title: "A title",
    };

    api.get.mockResolvedValueOnce(apiResponse);

    const [label, content] = await getLabelAndContent("", "00000000-0000-4000-8000-000000000001");

    expect(label).toStrictEqual(`[1.2.3] A title`);
    expect(content).toStrictEqual(`A title » Article 1.2.3\n\nA content`);
  });

  it(`should return the expected label, content (linked, empty <value>)`, async () => {
    const apiResponse = {
      content: "A content",
      index: "1.2.3",
      title: "A title",
    };

    api.get.mockResolvedValueOnce(apiResponse);

    const [label, content] = await getLabelAndContent(
      "A value",
      "00000000-0000-4000-8000-000000000001",
    );

    expect(label).toStrictEqual(`A value`);
    expect(content).toStrictEqual(`A title » Article 1.2.3\n\nA content`);
  });

  it(`should return the expected label, content (linked, no {title})`, async () => {
    const apiResponse = {
      content: "A content",
      index: "1.2.3",
      title: null,
    };

    api.get.mockResolvedValueOnce(apiResponse);

    const [label, content] = await getLabelAndContent(
      "A value",
      "00000000-0000-4000-8000-000000000001",
    );

    expect(label).toStrictEqual(`A value`);
    expect(content).toStrictEqual(`Article 1.2.3\n\nA content`);
  });

  it(`should return the expected label, content (linked, no {index})`, async () => {
    const apiResponse = {
      content: "A content",
      index: null,
      title: "A title",
    };

    api.get.mockResolvedValueOnce(apiResponse);

    const [label, content] = await getLabelAndContent(
      "A value",
      "00000000-0000-4000-8000-000000000001",
    );

    expect(label).toStrictEqual(`A value`);
    expect(content).toStrictEqual(`A title\n\nA content`);
  });

  it(`should return the expected label, content (linked, no {title}, no {index})`, async () => {
    const apiResponse = {
      content: "A content",
      index: null,
      title: null,
    };

    api.get.mockResolvedValueOnce(apiResponse);

    const [label, content] = await getLabelAndContent(
      "A value",
      "00000000-0000-4000-8000-000000000001",
    );

    expect(label).toStrictEqual(`A value`);
    expect(content).toStrictEqual(`A content`);
  });
});
