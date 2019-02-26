import { omit } from "ramda";
import React from "react";
import TurndownService from "turndown";

/**
 * React wrapper for medium-editor plugin with convert the HTML content into
 * Markdown.
 */
export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.turndownService = new TurndownService();
  }

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
    const markdownContent = this.turndownService.turndown(htmlContent);

    this.props.onChange(markdownContent);
  }

  render() {
    const props = omit(["defaultValue", "onChange"], this.props);

    return (
      <div ref={el => (this.el = el)} {...props}>
        {this.props.defaultValue}
      </div>
    );
  }
}
