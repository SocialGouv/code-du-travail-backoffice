import PropTypes from "prop-types";
import React from "react";

import * as C from "../../constants";
import Button from "../../elements/Button";
import Icon from "../../elements/Icon";
import SavingSpinner from "../../elements/SavingSpinner";
import cdtnApi from "../../libs/cdtnApi";
import LegalReferenceProps from "../../props/LegalReference";
import { ButtonsContainer, Container, Label, Tooltip } from "./Tag.style";
import TagEditorWithClickOutside from "./TagEditor";

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
      content: "",
      isEditing: false,
      isLoading: true,
      isObsolete: false,
    };

    this.edit = this.edit.bind(this);
    this.open = this.open.bind(this);
    this.unedit = this.unedit.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.loadUpdatedData();
  }

  async loadUpdatedData() {
    const { category, dila_cid, dila_id } = this.props;
    if (dila_id === null) {
      this.setState({ isLoading: false });

      return;
    }

    try {
      const path = category === C.LEGAL_REFERENCE_CATEGORY.AGREEMENT ? "/agreement" : "/code";
      const { content, id } = await cdtnApi.get(`${path}/article/${dila_cid}`);

      this.setState({
        content,
        isLoading: false,
        isObsolete: id !== dila_id,
      });
    } catch (err) {
      this.setState({
        isLoading: false,
        isObsolete: true,
      });
    }
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

  renderLabel() {
    const { value } = this.props;
    const { isObsolete } = this.state;

    return (
      <Label data-testid="label">
        {isObsolete && <Icon color="red" icon="exclamation-circle" withMarginRight />}
        {value}
      </Label>
    );
  }

  renderButtons() {
    const { category, dila_id, id, isReadOnly, onRemove, url } = this.props;

    const parts = [];

    if (dila_id !== null || url !== null) {
      parts.push(
        <Button
          data-testid="button-open"
          icon="link"
          isSmall
          isTransparent
          key="button-open"
          onClick={this.open}
        />,
      );
    }

    if (!isReadOnly && category !== C.LEGAL_REFERENCE_CATEGORY.LABOR_CODE) {
      parts.push(
        <Button
          data-testid="button-edit"
          icon="pen"
          isSmall
          isTransparent
          key="button-edit"
          onClick={this.edit}
        />,
      );
    }

    if (!isReadOnly) {
      parts.push(
        <Button
          data-testid="button-remove"
          icon="trash"
          isSmall
          isTransparent
          key="button-remove"
          onClick={() => onRemove(id)}
        />,
      );
    }

    return <ButtonsContainer>{parts}</ButtonsContainer>;
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <Container alignItems="center" justifyContent="center">
          <SavingSpinner color="var(--color-eerie-black)" size={16} />
        </Container>
      );
    }

    const { id, url, value } = this.props;
    const { content, isEditing } = this.state;
    const hasContent = content.length !== 0;

    if (isEditing) {
      return (
        <Container isEditing>
          <TagEditorWithClickOutside
            data-testid="tag-editor"
            onCancel={this.unedit}
            onSubmit={this.update}
            url={url}
            value={value}
          />
        </Container>
      );
    }

    return (
      <Container
        alignItems="flex-start"
        data-for={id}
        data-tip={content}
        isLegacy={this.isLegacy}
        justifyContent="space-between"
      >
        {this.renderLabel()}
        {this.renderButtons()}
        {hasContent && (
          <Tooltip
            clickable
            data-testid="tooltip"
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
  ...LegalReferenceProps,
  isReadOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
};

export default Tag;
