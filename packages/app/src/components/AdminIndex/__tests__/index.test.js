import { cleanup, fireEvent, render } from "@testing-library/react";
import React from "react";

jest.mock("react-redux", () => ({
  connect: () => component => {
    component.defaultProps = {
      ...component.defaultProps,
      modal: {
        isVisible: false,
        message: "",
      },
    };

    return component;
  },
}));

import AdminIndex from "..";

const DATA = [
  {
    aDataProp: "First Data Prop Value",
    anotherDataProp: "First Other Data Prop Value",
    created_at: 0,
    id: "b864ea83-cdbd-45f5-bca4-75efbb6b8954",
    updated_at: 0,
  },
];
const PROPS = {
  apiPath: "/an-api-get-uri",
  ariaLabels: {
    cancelDeletionButton: `An aria label for the cancel deletion button`,
    confirmDeletionButton: `An aria label for the delete button`,
    deleteButton: `An aria label for the remove button`,
    editButton: `An aria label for the edit button`,
    newButton: `An aria label for the new button`,
  },
  columns: [
    {
      Header: "A Default Column",
      accessor: "aDataProp",
    },
  ],
};

describe.skip("components/<AdminIndex />", () => {
  const locationPathname = "/admin/items";

  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", locationPathname);

  const data = [
    ...DATA,
    {
      aDataProp: "Second Data Prop Value",
      anotherDataProp: "Second Other Data Prop Value",
      created_at: 0,
      id: "631e6a28-2c7d-4bb5-983a-16962caae1e4",
      updated_at: 0,
    },
  ];

  const props = {
    ...PROPS,
    columns: [
      ...PROPS.columns,
      {
        Header: "A Custom Accessor Column",
        accessor: jest.fn(item => item.anotherDataProp),
        id: "anotherDataProp",
      },
    ],
  };

  let γ;

  it("should match snapshot", () => {
    global.axios.get.mockResolvedValueOnce({ data });

    γ = render(<AdminIndex {...props} />);

    expect(γ.container).toMatchSnapshot();
    expect(global.axios.get).toHaveBeenCalledWith(`${props.apiPath}?order=updated_at.desc`);
  });

  it("should redirect to the creation path", async () => {
    fireEvent.click(γ.getAllByTitle(props.ariaLabels.newButton)[0]);

    expect(global.nextRouter.push).toHaveBeenCalledWith(`${locationPathname}/new`);
  });

  it("should redirect to the edition path", async () => {
    fireEvent.click(γ.getAllByTitle(props.ariaLabels.editButton)[0]);
    await waitFor(0);

    expect(global.nextRouter.push).toHaveBeenCalledWith(
      {
        pathname: `${locationPathname}/edit`,
        query: { id: data[0].id },
      },
      `${locationPathname}/${data[0].id}`,
    );
  });

  it("should behave as expected when asking for deletion", async () => {
    fireEvent.click(γ.getAllByTitle(props.ariaLabels.deleteButton)[0]);
    await waitFor(0);

    expect(γ.getAllByTitle(props.ariaLabels.cancelDeletionButton)[0]).toBeInTheDocument();
    expect(γ.getAllByTitle(props.ariaLabels.confirmDeletionButton)[0]).toBeInTheDocument();
  });

  it("should behave as expected when cancelling deletion", async () => {
    fireEvent.click(γ.getAllByTitle(props.ariaLabels.cancelDeletionButton)[0]);
    await waitFor(0);

    expect(γ.queryByTitle(props.ariaLabels.cancelDeletionButton)).not.toBeInTheDocument();
    expect(γ.queryByTitle(props.ariaLabels.confirmDeletionButton)).not.toBeInTheDocument();
  });

  it("should behave as expected when confirming deletion", async () => {
    global.axios.get.mockReset();
    global.axios.get.mockResolvedValueOnce({ data });

    fireEvent.click(γ.getAllByTitle(props.ariaLabels.deleteButton)[0]);
    await waitFor(0);
    fireEvent.click(γ.getAllByTitle(props.ariaLabels.confirmDeletionButton)[0]);
    await waitFor(0);

    expect(global.axios.delete).toHaveBeenCalledWith(`${props.apiPath}?id=eq.${data[0].id}`);
    expect(global.axios.get).toHaveBeenCalledWith(`${props.apiPath}?order=updated_at.desc`);
  });
});

describe.skip("components/<AdminIndex /> (custom API paths)", () => {
  const locationPathname = "/admin/items";

  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", locationPathname);

  const props = {
    apiPath: "/an-api-get-uri",
    ariaLabels: {
      cancelDeletionButton: `An aria label for the cancel deletion button`,
      confirmDeletionButton: `An aria label for the delete button`,
      deleteButton: `An aria label for the remove button`,
      editButton: `An aria label for the edit button`,
      newButton: `An aria label for the new button`,
    },
    columns: [
      {
        Header: "A Default Column",
        accessor: "aDataProp",
      },
    ],
  };

  it("should behave as expected when confirming deletion", async () => {
    cleanup();
    global.axios.get.mockReset();
    global.axios.get.mockResolvedValueOnce({ data: DATA });
    global.axios.post.mockReset();

    const { getByTitle } = render(<AdminIndex {...props} />);
    await waitFor(0);

    global.axios.get.mockResolvedValueOnce({ data: DATA });

    fireEvent.click(getByTitle(props.ariaLabels.deleteButton));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.confirmDeletionButton));
    await waitFor(0);

    expect(global.axios.post).toHaveBeenCalledWith(props.apiPath, {
      id: DATA[0].id,
    });
    expect(global.axios.get).toHaveBeenCalledWith(`${props.apiPath}?order=updated_at.desc`);
  });
});

describe.skip("components/<AdminIndex /> (noTimestamps)", () => {
  const locationPathname = "/admin/items";

  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", locationPathname);

  const props = {
    ...PROPS,
    noTimestamps: true,
  };

  it("should call the expected URI after rendering", async () => {
    cleanup();
    global.axios.get.mockReset();
    global.axios.get.mockResolvedValueOnce({ data: DATA });

    render(<AdminIndex {...props} />);

    await waitFor(0);

    expect(global.axios.get).toHaveBeenCalledWith(props.apiPath);
  });
});

describe.skip("components/<AdminIndex /> (noEdit)", () => {
  const locationPathname = "/admin/items";

  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", locationPathname);

  const props = {
    ...PROPS,
    noEdit: true,
  };

  it("should not show the remove button", async () => {
    cleanup();
    global.axios.get.mockReset();
    global.axios.get.mockResolvedValueOnce({ data: DATA });

    const { queryByTitle } = render(<AdminIndex {...props} />);

    await waitFor(0);

    expect(queryByTitle(props.ariaLabels.editButton)).not.toBeInTheDocument();
  });
});

describe.skip("components/<AdminIndex /> (noDelete)", () => {
  const locationPathname = "/admin/items";

  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", locationPathname);

  const props = {
    ...PROPS,
    noDelete: true,
  };

  it("should not show the remove button", async () => {
    cleanup();
    global.axios.get.mockReset();
    global.axios.get.mockResolvedValueOnce({ data: DATA });

    const { queryByTitle } = render(<AdminIndex {...props} />);

    await waitFor(0);

    expect(queryByTitle(props.ariaLabels.deleteButton)).not.toBeInTheDocument();
  });
});

describe.skip("components/<AdminIndex /> (errors)", () => {
  const locationPathname = "/admin/items";

  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", locationPathname);

  const props = {
    ...PROPS,
    columns: [],
  };

  it("should behave as expected with API errors", async () => {
    const error = "An error";

    cleanup();
    global.axios.delete.mockReset();
    global.axios.get.mockReset();
    global.console.warn.mockReset();

    global.axios.get.mockResolvedValueOnce({ data: DATA });
    global.axios.delete.mockRejectedValueOnce();

    const { getByTitle } = render(<AdminIndex {...props} />);
    await waitFor(0);

    fireEvent.click(getByTitle(props.ariaLabels.deleteButton));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.confirmDeletionButton));
    await waitFor(0);

    expect(global.console.warn).toHaveBeenCalledTimes(0);

    global.axios.delete.mockRejectedValueOnce(error);

    fireEvent.click(getByTitle(props.ariaLabels.deleteButton));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.confirmDeletionButton));
    await waitFor(0);

    expect(global.console.warn).toHaveBeenCalledTimes(1);
    expect(global.console.warn).toHaveBeenCalledWith(error);

    global.axios.get.mockRejectedValueOnce();
    global.axios.delete.mockResolvedValueOnce();

    fireEvent.click(getByTitle(props.ariaLabels.deleteButton));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.confirmDeletionButton));
    await waitFor(0);

    expect(global.console.warn).toHaveBeenCalledTimes(1);

    global.axios.get.mockRejectedValueOnce(error);
    global.axios.delete.mockResolvedValueOnce();

    fireEvent.click(getByTitle(props.ariaLabels.deleteButton));
    await waitFor(0);
    fireEvent.click(getByTitle(props.ariaLabels.confirmDeletionButton));
    await waitFor(0);

    expect(global.console.warn).toHaveBeenCalledTimes(2);
    expect(global.console.warn).toHaveBeenCalledWith(error);
  });
});
