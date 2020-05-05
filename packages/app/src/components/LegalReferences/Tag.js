import PropTypes from "prop-types";
import React from "react";

import * as C from "../../constants";
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
    const { category, dila_id } = props;

    this.isLegacy = category !== null && dila_id === null;
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
    const { answer_id, id, category, dila_cid, dila_container_id, dila_id, onChange } = this.props;

    const data = {
      answer_id,
      category,
      dila_cid,
      dila_container_id,
      dila_id,
      id,
      url,
      value,
    };

    onChange(data);
  }

  open() {
    const { category, dila_container_id, dila_id, url } = this.props;

    if (url !== null) {
      window.open(url, "_blank");

      return;
    }

    const legifranceUriExtra =
      dila_container_id !== null ? `/?idConteneur=${dila_container_id}` : "";
    const legifranceUri = `${BASE_URL[category]}${dila_id}${legifranceUriExtra}`;

    window.open(legifranceUri, "_blank");
  }

  renderButtons() {
    const { category, dila_id, id, isReadOnly, onRemove, url } = this.props;

    const parts = [];

    if (dila_id !== null || url !== null) {
      parts.push(<Button icon="link" isSmall isTransparent key="1" onClick={this.open} />);
    }

    if (!isReadOnly && category !== C.LEGAL_REFERENCE_CATEGORY.LABOR_CODE) {
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
    const { category, id, noContent, url } = this.props;
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

    return (
      <Container
        alignItems="flex-start"
        data-for={id}
        data-tip={content}
        isLegacy={this.isLegacy}
        justifyContent="space-between"
      >
        <Label>{label}</Label>
        {this.renderButtons()}
        {!noContent && hasContent && (
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
  isReadOnly: PropTypes.bool,
  noContent: PropTypes.bool,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
};

export default Tag;
