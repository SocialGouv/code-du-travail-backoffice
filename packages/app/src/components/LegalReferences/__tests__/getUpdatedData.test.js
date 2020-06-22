jest.mock("../../../libs/api");

import api from "../../../libs/api";
import getUpdatedData from "../getUpdatedData";

describe("components/LegalReferences/getUpdatedData()", () => {
  it(`should return the expected label, content (unlinked, non-empty <value>)`, async () => {
    const input = {
      dila_cid: null,
      dila_id: null,
      value: "A value",
    };
    const received = await getUpdatedData(input);

    expect(received.label).toStrictEqual(`A value`);
    expect(received.content).toBeNull();
  });

  it(`should return the expected label, content (linked, empty <value>)`, async () => {
    const apiResponse = {
      content: "A content",
      index: "1.2.3",
      title: "A title",
    };
    api.get.mockResolvedValueOnce(apiResponse);

    const input = {
      dila_cid: "00000000-0000-4000-8000-000000000001",
      dila_id: "00000000-0000-4000-8000-000000000002",
      value: "",
    };
    const received = await getUpdatedData(input);

    expect(received.label).toStrictEqual(`[1.2.3] A title`);
    expect(received.content).toStrictEqual(`A title » Article 1.2.3\n\nA content`);
  });

  it(`should return the expected label, content (linked, non-empty <value>)`, async () => {
    const apiResponse = {
      content: "A content",
      index: "1.2.3",
      title: "A title",
    };
    api.get.mockResolvedValueOnce(apiResponse);

    const input = {
      dila_cid: "00000000-0000-4000-8000-000000000001",
      dila_id: "00000000-0000-4000-8000-000000000002",
      value: "A value",
    };
    const received = await getUpdatedData(input);

    expect(received.label).toStrictEqual(`A value`);
    expect(received.content).toStrictEqual(`A title » Article 1.2.3\n\nA content`);
  });

  it(`should return the expected label, content (linked, no {title})`, async () => {
    const apiResponse = {
      content: "A content",
      index: "1.2.3",
      title: null,
    };
    api.get.mockResolvedValueOnce(apiResponse);

    const input = {
      dila_cid: "00000000-0000-4000-8000-000000000001",
      dila_id: "00000000-0000-4000-8000-000000000002",
      value: "A value",
    };
    const received = await getUpdatedData(input);

    expect(received.label).toStrictEqual(`A value`);
    expect(received.content).toStrictEqual(`Article 1.2.3\n\nA content`);
  });

  it(`should return the expected label, content (linked, no {index})`, async () => {
    const apiResponse = {
      content: "A content",
      index: null,
      title: "A title",
    };
    api.get.mockResolvedValueOnce(apiResponse);

    const input = {
      dila_cid: "00000000-0000-4000-8000-000000000001",
      dila_id: "00000000-0000-4000-8000-000000000002",
      value: "A value",
    };
    const received = await getUpdatedData(input);

    expect(received.label).toStrictEqual(`A value`);
    expect(received.content).toStrictEqual(`A title\n\nA content`);
  });

  it(`should return the expected label, content (linked, no {title}, no {index})`, async () => {
    const apiResponse = {
      content: "A content",
      index: null,
      title: null,
    };
    api.get.mockResolvedValueOnce(apiResponse);

    const input = {
      dila_cid: "00000000-0000-4000-8000-000000000001",
      dila_id: "00000000-0000-4000-8000-000000000002",
      value: "A value",
    };
    const received = await getUpdatedData(input);

    expect(received.label).toStrictEqual(`A value`);
    expect(received.content).toStrictEqual(`A content`);
  });
});
