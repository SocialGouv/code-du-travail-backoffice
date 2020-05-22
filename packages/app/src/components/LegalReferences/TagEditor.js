import PropTypes from "prop-types";
import React from "react";
import reactOnClickOutside from "react-onclickoutside";

import { validateMandatoryNullableString } from "../../props/validators";
import { Form, UrlEditor, ValueEditor } from "./TagEditor.style";

export class TagEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    const { url } = props;

    this.hasUrl = url !== null;

    this.cancel = this.cancel.bind(this);
    this.maybeCancel = this.maybeCancel.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.maybeCancel);

    this.$value.focus();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.maybeCancel);
  }

  handleClickOutside() {
    this.cancel();
  }

  maybeCancel(event) {
    if (event.key !== "Escape" || event.repeat) return;
    event.preventDefault();

    this.cancel();
  }

  cancel() {
    const { onCancel } = this.props;

    onCancel();
  }

  submit(event) {
    event.preventDefault();

    const { onSubmit } = this.props;
    const value = this.$value.value;
    const url = this.hasUrl ? this.$url.value : null;

    onSubmit(value, url);
  }

  render() {
    const { url, value } = this.props;

    return (
      <Form data-testid="form" onSubmit={this.submit}>
        <ValueEditor
          data-testid="input-value"
          defaultValue={value}
          placeholder="Titre"
          ref={$node => (this.$value = $node)}
        />
        {this.hasUrl && (
          <UrlEditor
            data-testid="input-url"
            defaultValue={url}
            placeholder="URL"
            ref={$node => (this.$url = $node)}
          />
        )}
        <input hidden type="submit" />
      </Form>
    );
  }
}

TagEditor.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  url: validateMandatoryNullableString,
  value: PropTypes.string.isRequired,
};

const TagEditorWithClickOutside = reactOnClickOutside(TagEditor);

TagEditorWithClickOutside.displayName = "TagEditor";

export default TagEditorWithClickOutside;
