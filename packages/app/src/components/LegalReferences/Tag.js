import PropTypes from "prop-types";
import React from "react";

import Button from "../../elements/Button";
import getLabelAndContent from "./getLabelAndContent";
import {
  ButtonsContainer,
  Container,
  ContainerEditable,
  Label,
  LabelEditable,
  Tooltip,
} from "./Tag.style";

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
      isInput: false,
      isLoading: true,
      label: null,
    };

    this.enableEdition = this._enableEdition.bind(this);
    this.openUrl = this._openUrl.bind(this);
    this.onDocumentKeyUp = this._onDocumentKeyUp.bind(this);
    this.onKeyPress = this._onKeyPress.bind(this);
  }

  componentDidMount() {
    this.loadLabelAndContent();
  }

  componentDidUpdate() {
    if (this.$input !== null) {
      document.addEventListener("keyup", this.onDocumentKeyUp);

      this.$input.el.current.addEventListener("keypress", this.onKeyPress);
      this.$input.el.current.focus();
    }
  }

  componentWillUnmount() {
    const { isInput } = this.state;

    if (isInput) {
      this.disableEdition();
    }
  }

  _onDocumentKeyUp(event) {
    if (event.key !== "Escape") return;

    this.disableEdition(true);
  }

  _onKeyPress(event) {
    if (event.key !== "Enter") return;
    event.preventDefault();

    this.update();
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

  _enableEdition() {
    this.setState({ isInput: true });
  }

  disableEdition(andGoBack = false) {
    document.removeEventListener("keyup", this.onDocumentKeyUp);

    if (andGoBack) {
      this.setState({ isInput: false });
    }
  }

  update() {
    this.disableEdition();
    const { answer_id, id, category, dila_id, onChange, url } = this.props;

    const data = {
      answer_id,
      category,
      dila_id,
      id,
      url,
      value: this.$input.lastHtml,
    };

    onChange(data);
  }

  _openUrl() {
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
      parts.push(<Button icon="link" isSmall isTransparent key="1" onClick={this.openUrl} />);
    }

    if (isEditable) {
      parts.push(<Button icon="pen" isSmall isTransparent key="2" onClick={this.enableEdition} />);
    }

    if (!isReadOnly) {
      parts.push(
        <Button icon="trash" isSmall isTransparent key="3" onClick={() => onRemove(id)} />,
      );
    }

    return <ButtonsContainer>{parts}</ButtonsContainer>;
  }

  render() {
    const { category, dila_id, id } = this.props;
    const { content, isInput, isLoading, label } = this.state;

    if (isLoading) {
      return <Container alignItems="center">…</Container>;
    }

    if (isInput) {
      return (
        <ContainerEditable isLegacy={isLegacy}>
          <LabelEditable
            html={label}
            onBlur={() => this.disableEdition(true)}
            ref={$node => (this.$input = $node)}
          />
        </ContainerEditable>
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
  answer_id: PropTypes.string.isRequired,
  category: PropTypes.oneOf(["agreement", "labor_code", null]).isRequired,
  dila_id: PropTypes.string,
  id: PropTypes.string.isRequired,
  isEditable: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  url: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default Tag;
