import moment from "moment-timezone";
import React from "react";
import { fireEvent, render } from "@testing-library/react";

import AdminAnswer from "..";

import { ANSWER_STATE } from "../../../constants";

// Ignore styled-wrapped ReactTooltip className prop warning
console.warn = jest.fn();

const PROPS = {
  data: {
    id: "12345678-9abc-4def-0123-456789abcdef",
    generic_reference: null,
    state: ANSWER_STATE.DRAFT,
    updated_at: moment()
      .subtract(2, "hours")
      .tz("Europe/Paris"),
    prevalue: `Il m'est arrivé de sentir que tout allait bien pour moi, que<br>
            tout le monde était gai, et aussitôt l'idée me traversait<br>
            l'esprit qu'il ne se passerait plus rien et que tout était<br>
            absurde.`,
    agreement: {
      idcc: "1234",
      name: "An Agreement Name"
    },
    question: {
      index: 12,
      value: "A Question Value"
    },
    user: {
      name: "A User Name"
    }
  },
  onCheck: jest.fn()
};

describe("[Contrib] blocks/<AdminAnswer /> (Draft)", () => {
  const props = { ...PROPS };
  const λ = render(<AdminAnswer {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });

  it("should have called onCheck() with the expected param", () => {
    fireEvent.click(λ.getAllByRole("checkbox")[0]);

    expect(props.onCheck).toHaveBeenCalledWith(props.data.id);
  });
});

describe("[Contrib] blocks/<AdminAnswer /> (Draft falling back to LC)", () => {
  const props = {
    ...PROPS,
    data: {
      ...PROPS.data,
      generic_reference: "labor_code",
      value: ""
    }
  };
  const λ = render(<AdminAnswer {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });
});

describe("[Contrib] blocks/<AdminAnswer /> (Draft falling back to NA)", () => {
  const props = {
    ...PROPS,
    data: {
      ...PROPS.data,
      generic_reference: "national_agreement",
      value: ""
    }
  };
  const λ = render(<AdminAnswer {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });
});

describe("[Contrib] blocks/<AdminAnswer /> (Checked draft)", () => {
  const props = {
    ...PROPS,
    isChecked: true
  };
  const λ = render(<AdminAnswer {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });
});

describe("[Contrib] blocks/<AdminAnswer /> (Unchecked draft)", () => {
  const props = {
    ...PROPS,
    isChecked: false
  };
  const λ = render(<AdminAnswer {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });

  it("should have called onCheck() with the expected param", () => {
    fireEvent.click(λ.getAllByRole("checkbox")[0]);

    expect(props.onCheck).toHaveBeenCalledWith(props.data.id);
  });
});
