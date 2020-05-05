import React from "react";

import Answer from "..";

describe("components/<Answer />", () => {
  const DATA = {
    agreement_id: null,
    agreement_idcc: null,
    agreement_name: null,
    created_at: "1970-01-01T00:00:00.000000+00:00",
    generic_reference: null,
    id: "00000000-0000-4000-8000-000000000001",
    is_published: false,
    parent_id: null,
    prevalue: "A prevalue",
    question_id: "00000000-0000-4000-8000-000000000001",
    question_index: 1,
    question_value: "A question",
    state: "todo",
    updated_at: "1970-01-01T00:00:00.000000+00:00",
    value: "A value",
  };
  const ON_CHECK = jest.fn();
  const ON_CLICK = jest.fn();

  it(`should pass with a todo generic answer`, () => {
    const data = {
      ...DATA,
    };

    const $answer = testRender(
      <Answer data={data} isChecked={false} onCheck={ON_CHECK} onClick={ON_CLICK} />,
    );
    const $top = $answer.children[0];
    const $topState = $top.children[0];
    const $checkbox = $answer.children[1].children[0];
    const $content = $answer.children[1].children[1];
    const $contentIdcc = $content.children[0].children[0];
    const $contentIdccTootip = $contentIdcc.children[1];

    expect($top).toHaveTestRenderedChildrenTimes(1);

    expect($topState).toHaveTestRenderedText(`à rédiger`);

    expect($checkbox).toHaveTestRenderedProp("role", "checkbox");
    $checkbox.props.onClick();
    expect(ON_CHECK).toHaveBeenCalledTimes(1);
    expect(ON_CHECK).toHaveBeenCalledWith(data.id);

    expect($content).toHaveTestRenderedChildrenTimes(1);
    $content.props.onClick();
    expect(ON_CLICK).toHaveBeenCalledTimes(1);
    expect(ON_CLICK).toHaveBeenCalledWith(data.id);

    expect($contentIdcc).toHaveTestRenderedText(`CDT`);
    expect($contentIdccTootip).toHaveTestRenderedText(`Code du travail`);
  });

  it(`should pass with a checked todo generic answer`, () => {
    const data = {
      ...DATA,
    };

    const $answer = testRender(
      <Answer data={data} isChecked onCheck={ON_CHECK} onClick={ON_CLICK} />,
    );
    const $checkbox = $answer.children[1].children[0];

    expect($checkbox).toHaveTestRenderedProp("role", "checkbox");
    $checkbox.props.onClick();
    expect(ON_CHECK).toHaveBeenCalledTimes(1);
    expect(ON_CHECK).toHaveBeenCalledWith(data.id);
  });

  it(`should pass with a draft generic answer`, () => {
    const data = {
      ...DATA,
      state: "draft",
    };

    const $answer = testRender(
      <Answer data={data} isChecked={false} onCheck={ON_CHECK} onClick={ON_CLICK} />,
    );
    const $top = $answer.children[0];
    const $topState = $top.children[0];
    const $topIsPublished = $top.children[1].children[1];
    const $checkbox = $answer.children[1].children[0];
    const $content = $answer.children[1].children[1];
    const $contentIdcc = $content.children[0].children[0];
    const $contentIdccTootip = $contentIdcc.children[1];
    const $contentExtract = $content.children[1];

    expect($top).toHaveTestRenderedChildrenTimes(2);

    expect($topState).toHaveTestRenderedText(`en cours de rédaction`);

    expect($topIsPublished).toHaveStyleRule("opacity", "0.1");

    expect($checkbox).toHaveTestRenderedProp("role", "checkbox");
    $checkbox.props.onClick();
    expect(ON_CHECK).toHaveBeenCalledTimes(1);
    expect(ON_CHECK).toHaveBeenCalledWith(DATA.id);

    expect($content).toHaveTestRenderedChildrenTimes(2);
    $content.props.onClick();
    expect(ON_CLICK).toHaveBeenCalledTimes(1);
    expect(ON_CLICK).toHaveBeenCalledWith(DATA.id);

    expect($contentIdcc).toHaveTestRenderedText(`CDT`);
    expect($contentIdccTootip).toHaveTestRenderedText(`Code du travail`);

    expect($contentExtract).toHaveTestRenderedText(data.prevalue);
  });

  it(`should pass with a validated generic answer`, () => {
    const data = {
      ...DATA,
      state: "validated",
    };

    const $answer = testRender(
      <Answer data={data} isChecked={false} onCheck={ON_CHECK} onClick={ON_CLICK} />,
    );
    const $top = $answer.children[0];
    const $topState = $top.children[0];
    const $content = $answer.children[1].children[1];
    const $contentExtract = $content.children[1];

    expect($topState).toHaveTestRenderedText(`validée`);

    expect($contentExtract).toHaveTestRenderedText(data.value);
    expect($contentExtract).toHaveStyleRule("color", "var(--color-text-gray)");
  });

  it(`should pass with a validated answer`, () => {
    const data = {
      ...DATA,
      agreement_id: "00000000-0000-4000-8000-000000000001",
      agreement_idcc: "1234",
      agreement_name: "An agreement",
      state: "validated",
    };

    const $answer = testRender(
      <Answer data={data} isChecked={false} onCheck={ON_CHECK} onClick={ON_CLICK} />,
    );
    const $content = $answer.children[1].children[1];
    const $contentIdcc = $content.children[0].children[0];
    const $contentIdccTootip = $contentIdcc.children[1];

    expect($contentIdcc).toHaveTestRenderedText(data.agreement_idcc);
    expect($contentIdccTootip).toHaveTestRenderedText(data.agreement_name);
  });

  it(`should pass with a published validated generic answer`, () => {
    const data = {
      ...DATA,
      is_published: true,
      state: "validated",
    };

    const $answer = testRender(
      <Answer data={data} isChecked={false} onCheck={ON_CHECK} onClick={ON_CLICK} />,
    );
    const $top = $answer.children[0];
    const $topIsPublished = $top.children[1].children[1];

    expect($topIsPublished).toHaveStyleRule("opacity", "1");
  });

  it(`should pass with a labor-code-forwarded validated generic answer`, () => {
    const data = {
      ...DATA,
      generic_reference: "labor_code",
      state: "validated",
    };

    const $answer = testRender(
      <Answer data={data} isChecked={false} onCheck={ON_CHECK} onClick={ON_CLICK} />,
    );
    const $content = $answer.children[1].children[1];
    const $contentExtract = $content.children[1];

    expect($contentExtract).toHaveTestRenderedText("Renvoyé au Code du travail.");
    expect($contentExtract).toHaveStyleRule("color", "var(--color-text-red)");
  });

  it(`should pass with a national-agreement-forwarded validated generic answer`, () => {
    const data = {
      ...DATA,
      generic_reference: "national_agreement",
      state: "validated",
    };

    const $answer = testRender(
      <Answer data={data} isChecked={false} onCheck={ON_CHECK} onClick={ON_CLICK} />,
    );
    const $content = $answer.children[1].children[1];
    const $contentExtract = $content.children[1];

    expect($contentExtract).toHaveTestRenderedText("Renvoyé à la convention collective nationale.");
    expect($contentExtract).toHaveStyleRule("color", "var(--color-text-red)");
  });
});
