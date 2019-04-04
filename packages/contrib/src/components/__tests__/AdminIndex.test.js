import React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";

import "../../../__mocks__/console";
import "../../../__mocks__/waitFor";

import Router from "next/router";
jest.mock("next/router");

import AdminIndex from "../AdminIndex";

describe("[Contrib] components/<AdminIndex />", () => {
  const locationPathname = "/admin/items";

  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", locationPathname);

  const data = [
    {
      id: "b864ea83-cdbd-45f5-bca4-75efbb6b8954",
      aDataProp: "First Data Prop Value",
      anotherDataProp: "First Other Data Prop Value",
      updated_at: 0,
      created_at: 0
    },
    {
      id: "631e6a28-2c7d-4bb5-983a-16962caae1e4",
      aDataProp: "Second Data Prop Value",
      anotherDataProp: "Second Other Data Prop Value",
      updated_at: 0,
      created_at: 0
    }
  ];

  const props = {
    apiPath: "/an-api-get-uri",
    ariaLabels: {
      cancelDeletionButton: `An aria label for the cancel deletion button`,
      deleteButton: `An aria label for the delete button`,
      editButton: `An aria label for the edit button`,
      newButton: `An aria label for the new button`,
      removeButton: `An aria label for the remove button`
    },
    columns: [
      {
        Header: "A Default Column",
        accessor: "aDataProp"
      },
      {
        Header: "A Custom Accessor Column",
        accessor: jest.fn(item => item.anotherDataProp),
        id: "anotherDataProp"
      }
    ]
  };

  let asFragment, container, getByTitle, queryByTitle;
  let firstRender;

  it("should match snapshot", () => {
    global.axios.get.mockResolvedValueOnce({ data });

    const r = render(<AdminIndex {...props} />);
    asFragment = r.asFragment;
    container = r.container;
    getByTitle = r.getByTitle;
    queryByTitle = r.queryByTitle;
    firstRender = asFragment();

    expect(container).toMatchSnapshot();
    expect(global.axios.get).toHaveBeenCalledWith(
      `${props.apiPath}?order=updated_at.desc`
    );
  });

  it("should redirect to the creation path", async () => {
    fireEvent.click(getByTitle(props.ariaLabels.newButton));

    expect(Router.push).toBeCalledWith(`${locationPathname}/new`);
  });

  it("should redirect to the edition path", async () => {
    fireEvent.click(getByTitle(props.ariaLabels.editButton));
    await waitFor(0);

    expect(Router.push).toBeCalledWith(
      {
        pathname: `${locationPathname}/edit`,
        query: { id: data[0].id }
      },
      `${locationPathname}/${data[0].id}`
    );
  });

  it("should behave as expected when asking for deletion", async () => {
    fireEvent.click(getByTitle(props.ariaLabels.removeButton));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
    expect(
      queryByTitle(props.ariaLabels.cancelDeletionButton)
    ).toBeInTheDocument();
    expect(queryByTitle(props.ariaLabels.deleteButton)).toBeInTheDocument();
  });

  it("should behave as expected when cancelling deletion", async () => {
    fireEvent.click(getByTitle(props.ariaLabels.cancelDeletionButton));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(null);
    expect(
      queryByTitle(props.ariaLabels.cancelDeletionButton)
    ).not.toBeInTheDocument();
    expect(queryByTitle(props.ariaLabels.deleteButton)).not.toBeInTheDocument();
  });

  it("should behave as expected when confirming deletion", async () => {
    global.axios.get.mockReset();
    global.axios.get.mockResolvedValueOnce({ data });

    fireEvent.click(getByTitle(props.ariaLabels.removeButton));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.deleteButton));
    await waitFor(0);

    expect(firstRender).toMatchDiffSnapshot(null);
    expect(global.axios.delete).toHaveBeenCalledWith(
      `${props.apiPath}?id=eq.${data[0].id}`
    );
    expect(global.axios.get).toHaveBeenCalledWith(
      `${props.apiPath}?order=updated_at.desc`
    );
  });
});

describe("[Contrib] components/<AdminIndex /> (custom API paths)", () => {
  const locationPathname = "/admin/items";

  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", locationPathname);

  const data = [
    {
      id: "b864ea83-cdbd-45f5-bca4-75efbb6b8954",
      aDataProp: "First Data Prop Value",
      anotherDataProp: "First Other Data Prop Value",
      updated_at: 0,
      created_at: 0
    }
  ];

  const props = {
    apiDeletePath: "/an-api-delete-uri",
    apiGetPath: "/an-api-get-uri",
    ariaLabels: {
      cancelDeletionButton: `An aria label for the cancel deletion button`,
      deleteButton: `An aria label for the delete button`,
      editButton: `An aria label for the edit button`,
      newButton: `An aria label for the new button`,
      removeButton: `An aria label for the remove button`
    },
    columns: [
      {
        Header: "A Default Column",
        accessor: "aDataProp"
      }
    ]
  };

  it("should behave as expected when confirming deletion", async () => {
    cleanup();
    global.axios.get.mockReset();
    global.axios.get.mockResolvedValueOnce({ data });
    global.axios.post.mockReset();

    const { getByTitle } = render(<AdminIndex {...props} />);
    await waitFor(0);

    global.axios.get.mockResolvedValueOnce({ data });

    fireEvent.click(getByTitle(props.ariaLabels.removeButton));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.deleteButton));
    await waitFor(0);

    expect(global.axios.post).toHaveBeenCalledWith(props.apiDeletePath, {
      id: data[0].id
    });
    expect(global.axios.get).toHaveBeenCalledWith(
      `${props.apiGetPath}?order=updated_at.desc`
    );
  });
});

describe("[Contrib] components/<AdminIndex /> (errors)", () => {
  const locationPathname = "/admin/items";

  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", locationPathname);

  const data = [
    {
      id: "b864ea83-cdbd-45f5-bca4-75efbb6b8954",
      aDataProp: "First Data Prop Value",
      anotherDataProp: "First Other Data Prop Value",
      updated_at: 0,
      created_at: 0
    }
  ];

  const props = {
    apiPath: "/an-api-get-uri",
    ariaLabels: {
      cancelDeletionButton: `An aria label for the cancel deletion button`,
      deleteButton: `An aria label for the delete button`,
      editButton: `An aria label for the edit button`,
      newButton: `An aria label for the new button`,
      removeButton: `An aria label for the remove button`
    },
    columns: []
  };

  it("should behave as expected with API errors", async () => {
    const error = "An error";

    cleanup();
    global.axios.delete.mockReset();
    global.axios.get.mockReset();
    global.console.warn.mockReset();

    global.axios.get.mockResolvedValueOnce({ data });
    global.axios.delete.mockRejectedValueOnce();

    const { getByTitle } = render(<AdminIndex {...props} />);
    await waitFor(0);

    fireEvent.click(getByTitle(props.ariaLabels.removeButton));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.deleteButton));
    await waitFor(0);

    expect(global.console.warn).toHaveBeenCalledTimes(0);

    global.axios.delete.mockRejectedValueOnce(error);

    fireEvent.click(getByTitle(props.ariaLabels.removeButton));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.deleteButton));
    await waitFor(0);

    expect(global.console.warn).toHaveBeenCalledTimes(1);
    expect(global.console.warn).toHaveBeenCalledWith(error);

    global.axios.get.mockRejectedValueOnce();
    global.axios.delete.mockResolvedValueOnce();

    fireEvent.click(getByTitle(props.ariaLabels.removeButton));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.deleteButton));
    await waitFor(0);

    expect(global.console.warn).toHaveBeenCalledTimes(1);

    global.axios.get.mockRejectedValueOnce(error);
    global.axios.delete.mockResolvedValueOnce();

    fireEvent.click(getByTitle(props.ariaLabels.removeButton));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.deleteButton));
    await waitFor(0);

    expect(global.console.warn).toHaveBeenCalledTimes(2);
    expect(global.console.warn).toHaveBeenCalledWith(error);
  });
});
