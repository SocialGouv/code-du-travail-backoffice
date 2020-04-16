import PropTypes from "prop-types";
import React from "react";
import reactOnClickOutside from "react-onclickoutside";

import { Container, UrlEditor, ValueEditor } from "./TagEditor.style";

class _Tag extends React.PureComponent {
  constructor(props) {
    super(props);
    const { url } = props;

    this.hasUrl = url !== undefined;

    this.cancel = this.cancel.bind(this);
    this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keyup", this.onDocumentKeyUp);

    this.$value.el.current.addEventListener("keypress", this.onKeyPress);
    if (this.hasUrl) {
      this.$url.el.current.addEventListener("keypress", this.onKeyPress);
    }

    this.$value.el.current.focus();
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.onDocumentKeyUp);
  }

  handleClickOutside = function () {
    this.cancel();
  };

  onDocumentKeyUp(event) {
    if (event.key !== "Escape") return;
    event.preventDefault();

    this.cancel();
  }

  onKeyPress(event) {
    if (event.key !== "Enter") return;
    event.preventDefault();

    this.submit();
  }

  cancel() {
    const { onCancel } = this.props;

    onCancel();
  }

  submit() {
    const { onSubmit } = this.props;
    const value = this.$value.lastHtml;
    const url = this.hasUrl ? this.$url.lastHtml : null;

    onSubmit(value, url);
  }

  render() {
    const { url, value } = this.props;

    return (
      <Container>
        <ValueEditor html={value} ref={$node => (this.$value = $node)} />
        {this.hasUrl && <UrlEditor html={url} ref={$node => (this.$url = $node)} />}
      </Container>
    );
  }
}

_Tag.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  url: PropTypes.string,
  value: PropTypes.string.isRequired,
};

const Tag = reactOnClickOutside(_Tag);

export default Tag;
