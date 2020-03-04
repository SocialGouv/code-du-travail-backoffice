import React from "react";

import { LEGAL_REFERENCE_CATEGORY } from "../../constants";
import customAxios from "../../libs/customAxios";
import { Button, Container, Index, Label, Tooltip } from "./Tag.style";

const BASE_URL = {
  agreement: "https://beta.legifrance.gouv.fr/conv_coll/id/",
  labor_code: "https://beta.legifrance.gouv.fr/codes/article_lc/",
};

export default class Tag extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: null,
      index: null,
      title: null,
    };
  }

  componentDidMount() {
    const { value } = this.props;

    if (value.startsWith("KALI") || value.startsWith("LEGI")) {
      this.loadContent();
    }
  }

  async loadContent() {
    const { value } = this.props;

    const {
      data: { content, index, title },
    } = await customAxios().get(`/legal-references/${value}`);

    this.setState({ content, index, title });
  }

  openUrl() {
    const { category, value } = this.props;

    window.open(`${BASE_URL[category]}${value}`, "_blank");
  }

  renderLabel() {
    const { category, value } = this.props;
    const { index, title } = this.state;
    const parts = [];

    if (index !== null) {
      parts.push(<Index key="index">{index}</Index>);
    }

    if (category === LEGAL_REFERENCE_CATEGORY.AGREEMENT) {
      const label = title !== null ? title : value;

      parts.push(<Label key="label">{label}</Label>);
    }

    return parts;
  }

  renderButtons() {
    const { id, onRemove } = this.props;
    const { content } = this.state;

    const hasContent = content !== null && content.length !== 0;
    const parts = [];

    if (hasContent) {
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

    return parts;
  }

  render() {
    const { id } = this.props;
    const { content } = this.state;

    const hasContent = content !== null && content.length !== 0;

    return (
      <Container alignItems="center" data-for={id} data-tip={content}>
        {this.renderLabel()}
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
