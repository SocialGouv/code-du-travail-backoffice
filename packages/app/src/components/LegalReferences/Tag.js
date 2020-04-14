import PropTypes from "prop-types";
import React from "react";

import Button from "../../elements/Button";
import getLabelAndContent from "./getLabelAndContent";
import { ButtonsContainer, Container, Label, Tooltip } from "./Tag.style";

const BASE_URL = {
  agreement: "https://beta.legifrance.gouv.fr/conv_coll/id/",
  labor_code: "https://beta.legifrance.gouv.fr/codes/article_lc/",
};

class Tag extends React.PureComponent {
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
    const { dila_id, id, isReadOnly, onChange, onRemove, url } = this.props;

    const parts = [];

    if (dila_id !== null || url !== null) {
      parts.push(
        <Button icon="link" isSmall isTransparent key="1" onClick={this.openUrl.bind(this)} />,
      );
    }

    if (!isReadOnly) {
      parts.push(
        <Button icon="pen" isSmall isTransparent key="2" onClick={() => console.log("edit")} />,
      );

      parts.push(
        <Button icon="trash" isSmall isTransparent key="3" onClick={() => onRemove(id)} />,
      );
    }

    return <ButtonsContainer>{parts}</ButtonsContainer>;
  }

  render() {
    const { category, dila_id, id } = this.props;
    const { content, isLoading, label } = this.state;

    if (isLoading) {
      return <Container alignItems="center">…</Container>;
    }

    const hasContent = content !== null && content.length !== 0;
    const isLegacy = category !== null && dila_id === null;

    return (
      <Container
        alignItems="start"
        data-for={id}
        data-tip={content}
        isLegacy={isLegacy}
        justifyContent="space-between"
      >
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

Tag.propTypes = {
  category: PropTypes.string,
  dila_id: PropTypes.string,
  id: PropTypes.string,
  isReadOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  url: PropTypes.string,
  value: PropTypes.string,
};

export default Tag;
