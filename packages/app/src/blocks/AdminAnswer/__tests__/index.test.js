import { fireEvent, render } from "@testing-library/react";
import moment from "moment-timezone";
import React from "react";

import AdminAnswerBlock from "..";
import { ANSWER_STATE } from "../../../constants";

// Ignore styled-wrapped ReactTooltip className prop warning
console.warn = jest.fn();

const PROPS = {
  data: {
    agreement_idcc: "1234",
    agreement_name: "An Agreement Name",
    generic_reference: null,
    id: "12345678-9abc-4def-0123-456789abcdef",
    prevalue: `Il m'est arrivé de sentir que tout allait bien pour moi, que<br>
            tout le monde était gai, et aussitôt l'idée me traversait<br>
            l'esprit qu'il ne se passerait plus rien et que tout était<br>
            absurde`,
    question_index: 12,
    question_value: "A Question Value",
    state: ANSWER_STATE.DRAFT,
    updated_at: moment().subtract(2, "hours").tz("Europe/Paris"),
    user: {
      name: "A User Name",
    },
    value: `Il m'est arrivé de sentir que tout allait bien pour moi, que<br>
            tout le monde était gai, et aussitôt l'idée me traversait<br>
            l'esprit qu'il ne se passerait plus rien et que tout était<br>
            absurde.`,
  },
  onCheck: jest.fn(),
  onClick: jest.fn(),
};

describe.skip("blocks/<AdminAnswer /> (Draft)", () => {
  const props = { ...PROPS };
  const λ = render(<AdminAnswerBlock {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });

  it("should have called onCheck() with the expected param", () => {
    fireEvent.click(λ.getAllByRole("checkbox")[0]);

    expect(props.onCheck).toHaveBeenCalledWith(props.data.id);
  });

  it("should have called onClick() with the expected param", () => {
    fireEvent.click(
      λ.getAllByText(`${props.data.question_index}) ${props.data.question_value}`)[0],
    );

    expect(props.onClick).toHaveBeenCalledWith(props.data.id);
  });
});

// eslint-disable-next-line max-len
describe.skip("blocks/<AdminAnswer /> (Draft falling back to LC)", () => {
  const props = {
    ...PROPS,
    data: {
      ...PROPS.data,
      generic_reference: "labor_code",
      value: "",
    },
  };
  const λ = render(<AdminAnswerBlock {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });
});

// eslint-disable-next-line max-len
describe.skip("blocks/<AdminAnswer /> (Draft falling back to NA)", () => {
  const props = {
    ...PROPS,
    data: {
      ...PROPS.data,
      generic_reference: "national_agreement",
      value: "",
    },
  };
  const λ = render(<AdminAnswerBlock {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });
});

describe.skip("blocks/<AdminAnswer /> (Checked draft)", () => {
  const props = {
    ...PROPS,
    isChecked: true,
  };
  const λ = render(<AdminAnswerBlock {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });
});

describe.skip("blocks/<AdminAnswer /> (Unchecked draft)", () => {
  const props = {
    ...PROPS,
    isChecked: false,
  };
  const λ = render(<AdminAnswerBlock {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });

  it("should have called onCheck() with the expected param", () => {
    fireEvent.click(λ.getAllByRole("checkbox")[0]);

    expect(props.onCheck).toHaveBeenCalledWith(props.data.id);
  });
});

describe.skip("blocks/<AdminAnswer /> (To Do)", () => {
  const props = {
    ...PROPS,
    data: {
      ...PROPS.data,
      state: ANSWER_STATE.TO_DO,
    },
  };
  const λ = render(<AdminAnswerBlock {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });
});

describe.skip("blocks/<AdminAnswer /> (Pending Review)", () => {
  const props = {
    ...PROPS,
    data: {
      ...PROPS.data,
      state: ANSWER_STATE.PENDING_REVIEW,
    },
  };
  const λ = render(<AdminAnswerBlock {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });
});

describe.skip("blocks/<AdminAnswer /> (Under Review)", () => {
  const props = {
    ...PROPS,
    data: {
      ...PROPS.data,
      state: ANSWER_STATE.UNDER_REVIEW,
    },
  };
  const λ = render(<AdminAnswerBlock {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });
});

describe.skip("blocks/<AdminAnswer /> (Validated)", () => {
  const props = {
    ...PROPS,
    data: {
      ...PROPS.data,
      state: ANSWER_STATE.VALIDATED,
    },
  };
  const λ = render(<AdminAnswerBlock {...props} />);

  it("should match snapshot", () => {
    expect(λ.container).toMatchSnapshot();
  });
});
