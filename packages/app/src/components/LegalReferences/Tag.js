import React from "react";

import getLabelAndContent from "./getLabelAndContent";
import { Button, ButtonsContainer, Container, Label, Tooltip } from "./Tag.style";

const BASE_URL = {
  agreement: "https://beta.legifrance.gouv.fr/conv_coll/id/",
  labor_code: "https://beta.legifrance.gouv.fr/codes/article_lc/",
};

export default class Tag extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: null,
      isLoading: true,
      label: null,
    };
  }

  componentDidMount() {
    this.loadLabelAndContent();
  }

  async loadLabelAndContent() {
    const { dila_id, value } = this.props;

    const [label, content] = await getLabelAndContent(value, dila_id);

    this.setState({
      content,
      isLoading: false,
      label,
    });
  }

  openUrl() {
    const { category, dila_id, url } = this.props;

    if (url !== null) {
      window.open(url, "_blank");

      return;
    }

    window.open(`${BASE_URL[category]}${dila_id}`, "_blank");
  }

  renderButtons() {
    const { dila_id, id, onRemove, url } = this.props;

    const parts = [];

    if (dila_id !== null || url !== null) {
      parts.push(
        <Button alignItems="center" key="link" onClick={this.openUrl.bind(this)}>
          <img alt="" src="/static/images/link.svg" />
        </Button>,
      );
    }

    if (onRemove !== undefined) {
      parts.push(
        <Button
          alignItems="center"
          key="delete"
          onClick={() => onRemove(id)}
          src="/static/images/delete.svg"
        >
          <img alt="" src="/static/images/delete.svg" />
        </Button>,
      );
    }

    return <ButtonsContainer>{parts}</ButtonsContainer>;
  }

  render() {
    const { id } = this.props;
    const { content, isLoading, label } = this.state;

    if (isLoading) {
      return <Container alignItems="center">…</Container>;
    }

    const hasContent = content !== null && content.length !== 0;

    return (
      <Container alignItems="start" data-for={id} data-tip={content} justifyContent="space-between">
        <Label key="label">{label}</Label>
        {this.renderButtons()}
        {hasContent && (
          <Tooltip
            clickable={true}
            delayHide={250}
            effect="solid"
            id={id}
            place="bottom"
            type="light"
          />
        )}
      </Container>
    );
  }
}
