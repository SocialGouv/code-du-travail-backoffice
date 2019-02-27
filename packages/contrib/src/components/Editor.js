import { omit } from "ramda";
import React from "react";

/**
 * React wrapper for medium-editor plugin.
 */
export default class Editor extends React.Component {
  componentDidMount() {
    // We have to load medium-editor here because of the global `document`
    // variable check done by the original library.
    const MediumEditor = require("medium-editor");
    this.medium = new MediumEditor(this.el, {
      placeholder: {
        text: "Commencer ici votre réponse."
      }
    });
    this.medium.subscribe("editableInput", this.onChange.bind(this));
  }

  componentWillUnmount() {
    this.medium.destroy();
  }

  onChange() {
    if (this.props.onChange === undefined) return;

    const htmlContent = this.medium.getContent();
    this.props.onChange(htmlContent);
  }

  getHtmlSource() {
    return { __html: this.props.defaultValue };
  }

  render() {
    const props = omit(["defaultValue", "onChange"], this.props);

    return (
      <div
        dangerouslySetInnerHTML={this.getHtmlSource()}
        ref={el => (this.el = el)}
        {...props}
      />
    );
  }
}
