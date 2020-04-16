import PropTypes from "prop-types";
import React from "react";

import Button from "../../elements/Button";
import LegalReferenceProps from "../../props/LegalReference";
import getLabelAndContent from "./getLabelAndContent";
import { ButtonsContainer, Container, Label, Tooltip } from "./Tag.style";
import TagEditor from "./TagEditor";

const BASE_URL = {
  agreement: "https://beta.legifrance.gouv.fr/conv_coll/id/",
  labor_code: "https://beta.legifrance.gouv.fr/codes/article_lc/",
};

class Tag extends React.PureComponent {
  constructor(props) {
    super(props);

    this.$input = null;

    this.state = {
      content: null,
      isEditing: false,
      isLoading: true,
      label: null,
    };

    this.edit = this.edit.bind(this);
    this.open = this.open.bind(this);
    this.unedit = this.unedit.bind(this);
    this.update = this.update.bind(this);
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

  edit() {
    this.setState({ isEditing: true });
  }

  unedit() {
    this.setState({ isEditing: false });
  }

  update(value, url) {
    const { answer_id, id, category, dila_id, onChange } = this.props;

    const data = {
      answer_id,
      category,
      dila_id,
      id,
      url,
      value,
    };

    onChange(data);
  }

  open() {
    const { category, dila_id, url } = this.props;

    if (url !== null) {
      window.open(url, "_blank");

      return;
    }

    window.open(`${BASE_URL[category]}${dila_id}`, "_blank");
  }

  renderButtons() {
    const { dila_id, id, isEditable, isReadOnly, onRemove, url } = this.props;

    const parts = [];

    if (dila_id !== null || url !== null) {
      parts.push(<Button icon="link" isSmall isTransparent key="1" onClick={this.open} />);
    }

    if (isEditable) {
      parts.push(<Button icon="pen" isSmall isTransparent key="2" onClick={this.edit} />);
    }

    if (!isReadOnly) {
      parts.push(
        <Button icon="trash" isSmall isTransparent key="3" onClick={() => onRemove(id)} />,
      );
    }

    return <ButtonsContainer>{parts}</ButtonsContainer>;
  }

  render() {
    const { category, dila_id, id, url } = this.props;
    const { content, isEditing, isLoading, label } = this.state;

    if (isLoading) {
      return <Container alignItems="center">…</Container>;
    }

    const maybeUrl = category === null ? url : undefined;

    if (isEditing) {
      return (
        <Container isEditing>
          <TagEditor onCancel={this.unedit} onSubmit={this.update} url={maybeUrl} value={label} />
        </Container>
      );
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
        <Label>{label}</Label>
        {this.renderButtons()}
        {hasContent && (
          <Tooltip
            clickable={true}
            delayHide={250}
            effect="solid"
            id={id}
            place="right"
            type="light"
          />
        )}
      </Container>
    );
  }
}

Tag.propTypes = {
  ...LegalReferenceProps,
  isEditable: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
};

export default Tag;
