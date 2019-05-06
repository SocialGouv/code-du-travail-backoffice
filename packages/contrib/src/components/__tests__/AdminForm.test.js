import React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";

import "../../../__mocks__/console";
import "../../../__mocks__/waitFor";

import Router from "next/router";
jest.mock("next/router");

import AdminForm from "../AdminForm";

describe.skip("[Contrib] components/<AdminForm /> (create)", () => {
  const props = {
    apiPath: "/an-api-path",
    ariaLabels: {
      cancelButton: `An aria label for the cancel button`,
      createOrEditButton: `An aria label for the create button`
    },
    fields: [
      {
        type: "input",
        name: "defaultInput",
        label: "A Default Input"
      },
      {
        type: "input",
        name: "inputWithButton",
        label: "An Input With Button",
        button: {
          ariaLabel: "An Input Button",
          icon: "sync",
          handler: jest.fn(r => r + " that has been transformed")
        }
      },
      {
        type: "select",
        name: "defaultSelect",
        label: "A Default Select",
        options: [
          { name: "First Option", value: "first_option" },
          { name: "Second Option", value: "second_option" }
        ]
      },
      {
        type: "tags",
        name: "defaultTags",
        label: "A Default Tags",
        tags: [
          { id: "02dea6e4-3bf0-46a8-9144-9bd324ddcf08", value: "First A Tag" },
          { id: "ced5cec0-a7ff-4803-853e-026926426830", value: "Second A Tag" }
        ],
        ariaName: "le tag"
      },
      {
        type: "text",
        name: "defaultText",
        label: "A Default Textarea"
      },
      {
        type: "tags",
        name: "tagsWithCustomApiPath",
        label: "A Tags With Custom API Path",
        tags: [
          { id: "f64defb3-00d9-44c3-b620-4a05db71329d", value: "First B Tag" },
          { id: "c4d0aec3-c426-4bba-89db-9e89a92c163e", value: "Second B Tag" },
          { id: "056cbd22-00d1-4606-aea5-94dbd1042e0d", value: "Third B Tag" }
        ],
        ariaName: "la collection",
        apiPath: "/a-custom-api-path",
        singleName: "acollection"
      }
    ],
    indexPath: "/an-index-path",
    name: "anitem",
    title: "New Item"
  };

  const expectedData = {
    [props.fields[0].name]: "",
    [props.fields[1].name]: "",
    [props.fields[2].name]: "",
    [props.fields[3].name]: [],
    [props.fields[4].name]: ""
  };

  let asFragment,
    container,
    getByAltText,
    getByLabelText,
    getByPlaceholderText,
    getByText,
    getByTitle,
    queryByText;
  let firstRender;

  it("should match snapshot", () => {
    const r = render(<AdminForm {...props} />);
    asFragment = r.asFragment;
    container = r.container;
    getByAltText = r.getByAltText;
    getByLabelText = r.getByLabelText;
    getByPlaceholderText = r.getByPlaceholderText;
    getByText = r.getByText;
    getByTitle = r.getByTitle;
    queryByText = r.queryByText;
    firstRender = asFragment();

    expect(container).toMatchSnapshot();
  });

  it("should redirect to the index path", async () => {
    fireEvent.click(getByTitle(props.ariaLabels.cancelButton));

    expect(Router.push).toBeCalledWith(`/admin${props.indexPath}`);
  });

  it("should transform the input with button value as expected", async () => {
    const field = props.fields[1];
    const value = "an input with value button";
    expectedData[field.name] = value + " that has been transformed";

    fireEvent.input(getByLabelText(field.label), { target: { value } });
    fireEvent.click(getByTitle(field.button.ariaLabel));

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(getByLabelText(field.label).value).toBe(expectedData[field.name]);
  });

  it("should add a tag accordingly", async () => {
    global.axios.post.mockRejectedValueOnce({ response: {} });

    const field = props.fields[3];
    expectedData[field.name].push(field.tags[0].id);

    fireEvent.input(getByPlaceholderText(`Commencez à taper le nom du tag`), {
      target: { value: field.tags[0].value }
    });
    fireEvent.click(getByText(field.tags[0].value));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.createOrEditButton));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(global.axios.post).toHaveBeenCalledWith(props.apiPath, expectedData);
    expect(global.console.warn).toHaveBeenCalledWith({ response: {} });
  });

  it("should remove a tag accordingly", async () => {
    global.axios.post.mockRejectedValueOnce();

    const field = props.fields[3];
    expectedData[field.name] = [];

    fireEvent.click(
      getByAltText(`Bouton supprimant ${field.ariaName} ${field.tags[0].value}`)
    );
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.createOrEditButton));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(global.axios.post).toHaveBeenCalledWith(props.apiPath, expectedData);
  });

  it("should the expected error", async () => {
    global.axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "An error"
        }
      }
    });

    fireEvent.click(getByTitle(props.ariaLabels.createOrEditButton));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(queryByText("Erreur: An error.")).toBeInTheDocument();
  });

  it("should submit the expected data", async () => {
    const itemId = "110f8f6a-d714-45f1-8469-c5adeae60551";

    global.axios.post.mockReset();
    global.axios.post.mockResolvedValueOnce({
      headers: {
        location: `/an-api-path?id=eq.${itemId}`
      }
    });
    global.axios.post.mockResolvedValueOnce();

    expectedData[props.fields[0].name] = "a default input value";
    expectedData[props.fields[2].name] = "second_option";
    expectedData[props.fields[4].name] = "a default textarea value";

    fireEvent.input(getByLabelText(props.fields[0].label), {
      target: { value: expectedData[props.fields[0].name] }
    });
    fireEvent.change(getByLabelText(props.fields[2].label), {
      target: { value: "second_option" }
    });
    fireEvent.input(getByLabelText(props.fields[4].label), {
      target: { value: expectedData[props.fields[4].name] }
    });

    const field5 = props.fields[5];
    const expectedCustomData = [
      {
        anitem_id: itemId,
        acollection_id: field5.tags[1].id
      },
      {
        anitem_id: itemId,
        acollection_id: field5.tags[2].id
      }
    ];
    fireEvent.input(
      getByPlaceholderText(`Commencez à taper le nom de la collection`),
      {
        target: { value: field5.tags[1].value }
      }
    );
    fireEvent.click(getByText(field5.tags[1].value));
    await waitFor(0);
    fireEvent.input(
      getByPlaceholderText(`Commencez à taper le nom de la collection`),
      {
        target: { value: field5.tags[2].value }
      }
    );
    fireEvent.click(getByText(field5.tags[2].value));
    await waitFor(0);

    fireEvent.click(getByTitle(props.ariaLabels.createOrEditButton));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(global.axios.post).toHaveBeenCalledTimes(2);
    // https://stackoverflow.com/a/48078859/2736233
    expect(global.axios.post.mock.calls).toEqual([
      [props.apiPath, expectedData],
      [props.fields[5].apiPath, expectedCustomData]
    ]);
    expect(Router.push).toBeCalledWith(`/admin${props.indexPath}`);
  });
});

describe.skip("[Contrib] components/<AdminForm /> (edit)", () => {
  const props = {
    apiPath: "/an-api-path",
    ariaLabels: {
      cancelButton: `An aria label for the cancel button`,
      createOrEditButton: `An aria label for the edit button`
    },
    fields: [
      {
        type: "input",
        name: "defaultInput",
        label: "A Default Input"
      },
      {
        type: "input",
        name: "inputWithButton",
        label: "An Input With Button",
        button: {
          ariaLabel: "An Input Button",
          icon: "sync",
          handler: jest.fn(r => r + " that has been transformed")
        }
      },
      {
        type: "select",
        name: "defaultSelect",
        label: "A Default Select",
        options: [
          { name: "First Option", value: "first_option" },
          { name: "Second Option", value: "second_option" }
        ]
      },
      {
        type: "tags",
        name: "defaultTags",
        label: "A Default Tags",
        tags: [
          { id: "02dea6e4-3bf0-46a8-9144-9bd324ddcf08", value: "First A Tag" },
          { id: "ced5cec0-a7ff-4803-853e-026926426830", value: "Second A Tag" }
        ],
        ariaName: "le tag"
      },
      {
        type: "text",
        name: "defaultText",
        label: "A Default Textarea"
      },
      {
        type: "tags",
        name: "tagsWithCustomApiPath",
        label: "A Tags With Custom API Path",
        tags: [
          { id: "f64defb3-00d9-44c3-b620-4a05db71329d", value: "First B Tag" },
          { id: "c4d0aec3-c426-4bba-89db-9e89a92c163e", value: "Second B Tag" },
          { id: "056cbd22-00d1-4606-aea5-94dbd1042e0d", value: "Third B Tag" }
        ],
        ariaName: "la collection",
        apiPath: "/a-custom-api-path",
        singleName: "acollection"
      }
    ],
    id: "110f8f6a-d714-45f1-8469-c5adeae60551",
    indexPath: "/an-index-path",
    name: "anitem",
    title: "Edit Item"
  };

  const expectedData = {
    [props.fields[0].name]: "the original default input value",
    [props.fields[1].name]: "the original input button value",
    [props.fields[2].name]: "second_option",
    [props.fields[3].name]: [props.fields[3].tags[0].id],
    [props.fields[4].name]: ""
  };

  const field5 = props.fields[5];
  const expectedCustomData = [
    {
      anitem_id: props.id,
      acollection_id: field5.tags[1].id
    },
    {
      anitem_id: props.id,
      acollection_id: field5.tags[2].id
    }
  ];

  props.defaultData = {
    ...expectedData,
    [props.fields[3].name]: [props.fields[3].tags[0]],
    [props.fields[5].name]: [props.fields[5].tags[1], props.fields[5].tags[2]]
  };

  let asFragment, container, getByTitle;
  let firstRender;

  it("should match snapshot", () => {
    cleanup();
    const r = render(<AdminForm {...props} />);
    asFragment = r.asFragment;
    container = r.container;
    getByTitle = r.getByTitle;
    firstRender = asFragment();

    expect(container).toMatchSnapshot();
  });

  it("should submit the expected data", async () => {
    global.axios.patch.mockResolvedValueOnce();
    global.axios.delete.mockResolvedValueOnce();
    global.axios.post.mockResolvedValueOnce();

    fireEvent.click(getByTitle(props.ariaLabels.createOrEditButton));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(null);
    expect(global.axios.patch).toHaveBeenCalledWith(
      `${props.apiPath}?id=eq.${props.id}`,
      expectedData
    );
    expect(global.axios.delete).toHaveBeenCalledWith(
      `${props.fields[5].apiPath}?anitem_id=eq.${props.id}`
    );
    expect(global.axios.post).toHaveBeenCalledWith(
      props.fields[5].apiPath,
      expectedCustomData
    );
    expect(Router.push).toBeCalledWith(`/admin${props.indexPath}`);
  });
});

// eslint-disable-next-line max-len
describe.skip("[Contrib] components/<AdminForm /> (create / NO custom API)", () => {
  const props = {
    apiPath: "/an-api-path",
    ariaLabels: {
      cancelButton: `An aria label for the cancel button`,
      createOrEditButton: `An aria label for the creation button`
    },
    fields: [
      {
        type: "input",
        name: "defaultInput",
        label: "A Default Input",
        inputType: "number"
      }
    ],
    indexPath: "/an-index-path",
    name: "anitem",
    title: "Edit Item"
  };

  const expectedData = {
    [props.fields[0].name]: ""
  };

  let asFragment, container, getByRole, getByTitle;
  let firstRender;

  it("should match snapshot", () => {
    cleanup();
    const r = render(<AdminForm {...props} />);
    asFragment = r.asFragment;
    container = r.container;
    getByRole = r.getByRole;
    getByTitle = r.getByTitle;
    firstRender = asFragment();

    expect(container).toMatchSnapshot();
  });

  it("should submit the expected data", async () => {
    const itemId = "110f8f6a-d714-45f1-8469-c5adeae60551";

    global.axios.post.mockReset();
    global.axios.post.mockResolvedValueOnce({
      headers: {
        location: `/an-api-path?id=eq.${itemId}`
      }
    });
    global.axios.post.mockResolvedValueOnce();

    fireEvent.click(getByTitle(props.ariaLabels.createOrEditButton));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(global.axios.post).toHaveBeenCalledTimes(1);
    expect(global.axios.post).toBeCalledWith(props.apiPath, expectedData);
    expect(Router.push).toBeCalledWith(`/admin${props.indexPath}`);
  });

  it("should not resubmit the form", async () => {
    global.axios.post.mockReset();

    fireEvent.submit(getByRole("form"));
    await waitFor(0);

    expect(global.axios.post).toHaveBeenCalledTimes(0);
  });
});

// eslint-disable-next-line max-len
describe.skip("[Contrib] components/<AdminForm /> (edit / NO custom API)", () => {
  const props = {
    apiPath: "/an-api-path",
    ariaLabels: {
      cancelButton: `An aria label for the cancel button`,
      createOrEditButton: `An aria label for the edit button`
    },
    fields: [
      {
        type: "input",
        name: "defaultInput",
        label: "A Default Input",
        inputType: "number"
      }
    ],
    id: "110f8f6a-d714-45f1-8469-c5adeae60551",
    indexPath: "/an-index-path",
    name: "anitem",
    title: "Edit Item"
  };

  const expectedData = {
    [props.fields[0].name]: 123
  };

  props.defaultData = { ...expectedData };

  let asFragment, container, getByTitle;
  let firstRender;

  it("should match snapshot", () => {
    cleanup();
    const r = render(<AdminForm {...props} />);
    asFragment = r.asFragment;
    container = r.container;
    getByTitle = r.getByTitle;
    firstRender = asFragment();

    expect(container).toMatchSnapshot();
  });

  it("should submit the expected data", async () => {
    global.axios.patch.mockReset();
    global.axios.patch.mockResolvedValueOnce();

    fireEvent.click(getByTitle(props.ariaLabels.createOrEditButton));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(global.axios.patch).toHaveBeenCalledTimes(1);
    expect(global.axios.patch).toBeCalledWith(
      `${props.apiPath}?id=eq.${props.id}`,
      expectedData
    );
    expect(Router.push).toBeCalledWith(`/admin${props.indexPath}`);
  });
});

// eslint-disable-next-line max-len
describe.skip("[Contrib] components/<AdminForm /> (edit / isApiFunction)", () => {
  const props = {
    apiPath: "/an-api-path",
    ariaLabels: {
      cancelButton: `An aria label for the cancel button`,
      createOrEditButton: `An aria label for the edit button`
    },
    fields: [
      {
        type: "input",
        name: "defaultInput",
        label: "A Default Input",
        inputType: "number"
      }
    ],
    id: "110f8f6a-d714-45f1-8469-c5adeae60551",
    indexPath: "/an-index-path",
    isApiFunction: true,
    name: "anitem",
    title: "Edit Item"
  };

  const expectedData = {
    id: props.id,
    [props.fields[0].name]: 123
  };

  props.defaultData = { ...expectedData };

  let asFragment, container, getByTitle;
  let firstRender;

  it("should match snapshot", () => {
    cleanup();
    const r = render(<AdminForm {...props} />);
    asFragment = r.asFragment;
    container = r.container;
    getByTitle = r.getByTitle;
    firstRender = asFragment();

    expect(container).toMatchSnapshot();
  });

  it("should submit the expected data", async () => {
    global.axios.post.mockReset();
    global.axios.post.mockResolvedValueOnce();

    fireEvent.click(getByTitle(props.ariaLabels.createOrEditButton));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(global.axios.post).toHaveBeenCalledTimes(1);
    expect(global.axios.post).toBeCalledWith(props.apiPath, expectedData);
    expect(Router.push).toBeCalledWith(`/admin${props.indexPath}`);
  });
});
