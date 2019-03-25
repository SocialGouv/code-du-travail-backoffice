import { omit } from "ramda";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import markdown from "../libs/markdown";

import filePdfImageUri from "../images/file-pdf.svg";
import redoImageUri from "../images/redo.svg";
import tagsImageUri from "../images/tags.svg";
import undoImageUri from "../images/undo.svg";

const TextButton = styled.button`
  color: #444444;
  font-size: 0.875rem;
  width: auto !important;
`;
const TextButtonIcon = styled.img`
  height: 0.75rem;
  margin: ${props => (props.withText ? "2px 5px 0 2px" : "2px 3px 0")};
  vertical-align: -1px;
  width: 0.75rem;
`;

/**
 * React wrapper for Quill plugin converting the HTML source into Markdown.
 *
 * @description
 * The `defaultValueDelta` prop is expecting a Quill delta.
 *
 * @see https://quilljs.com/docs/delta/
 */
export default class Editor extends React.Component {
  componentDidMount() {
    const quillOptions = {
      theme: "snow",
      format: [
        "blockquote",
        "bold",
        "header",
        "italic",
        "link",
        "list",
        "underline"
      ],

      modules: {
        toolbar: {
          container: this.$toolbar,
          handlers: {
            charter: () =>
              window.open("/static/docs/Charte-Redactionnelle-v1.0.pdf"),
            redo: () => this.quill.history.redo(),
            tags: this.props.onTagsClicked,
            undo: () => this.quill.history.undo()
          }
        }
      }
    };

    // We have to load Quill here because of the global `document`
    // variable check done by the original library.
    const Quill = require("quill");
    this.quill = new Quill(this.$editor, quillOptions);
    this.quill.on("text-change", this.onChange.bind(this));

    this.quill.focus();
  }

  onChange() {
    if (this.props.onChange === undefined) return;

    const markdownContent = markdown.fromHtml(this.$editor.innerHTML);
    this.props.onChange(markdownContent);
  }

  getHtmlSource() {
    const htmlContent = markdown.toHtml(this.props.defaultValue);

    return { __html: htmlContent };
  }

  render() {
    const props = omit(
      ["defaultValue", "onChange", "onReferencesClicked", "onTagsClicked"],
      this.props
    );

    return (
      <Flex
        flexDirection="column"
        ref={el => (this.$container = el)}
        {...props}
      >
        <div className="ql-toolbar ql-snow" ref={el => (this.$toolbar = el)}>
          <span className="ql-formats">
            <TextButton type="button" className="ql-undo">
              <TextButtonIcon src={undoImageUri} />
            </TextButton>
            <TextButton type="button" className="ql-redo">
              <TextButtonIcon src={redoImageUri} />
            </TextButton>
          </span>
          <span className="ql-formats">
            <button type="button" className="ql-bold" />
            <button type="button" className="ql-italic" />
            <button type="button" className="ql-underline" />
          </span>
          <span className="ql-formats">
            <button type="button" className="ql-link" />
            <button type="button" className="ql-blockquote" />
          </span>
          <span className="ql-formats">
            <select className="ql-header" defaultValue="">
              <option value="">Normal</option>
              <option value="2">Titre</option>
              <option value="3">Sous-titre</option>
            </select>
          </span>
          <span className="ql-formats">
            <TextButton type="button" className="ql-tags">
              <TextButtonIcon src={tagsImageUri} withText />
              Étiquettes
            </TextButton>
          </span>
          <span className="ql-formats">
            <TextButton type="button" className="ql-charter">
              <TextButtonIcon src={filePdfImageUri} withText />
              Charte
            </TextButton>
          </span>
        </div>
        <div
          dangerouslySetInnerHTML={this.getHtmlSource()}
          ref={el => (this.$editor = el)}
          width={1}
        />
      </Flex>
    );
  }
}
