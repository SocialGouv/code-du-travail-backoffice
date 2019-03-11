import { omit } from "ramda";
import React from "react";
import { Flex } from "rebass";

import Markdown from "../lib/Markdown";

const markdown = new Markdown();

/**
 * React wrapper for medium-editor plugin converting the HTML source into
 * Markdown.
 *
 * @description
 * The `defaultValue` prop is expecting a string of Markdown.
 */
export default class Editor extends React.Component {
  componentDidMount() {
    // We have to load medium-editor here because of the global `document`
    // variable check done by the original library.
    const MediumEditor = require("medium-editor");

    this.medium = new MediumEditor(this.$editor, {
      disableDoubleReturn: true,
      disableExtraSpaces: true,
      elementsContainer: this.$container,
      spellcheck: false,
      updateOnEmptySelection: true,
      placeholder: {
        text: "Commencer ici votre réponse."
      },
      toolbar: {
        static: true
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
    const markdownContent = markdown.fromHtml(htmlContent);
    this.props.onChange(markdownContent);
  }

  getHtmlSource() {
    const htmlContent = markdown.toHtml(this.props.defaultValue);

    return { __html: htmlContent };
  }

  render() {
    const props = omit(["defaultValue", "onChange"], this.props);

    return (
      <Flex ref={el => (this.$container = el)} {...props}>
        <div
          dangerouslySetInnerHTML={this.getHtmlSource()}
          ref={el => (this.$editor = el)}
          width={1}
        />
      </Flex>
    );
  }
}
