import styled from "@emotion/styled";
import { omit } from "ramda";
import React from "react";
import { Flex } from "rebass";

import markdown from "../libs/markdown";

const TextButton = styled.button`
  color: #444444;
  font-size: 0.875rem;
  width: auto !important;
`;
const TextButtonIcon = styled.img`
  height: 0.75rem;
  margin: 2px 3px 0;
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
  // Quill can't be tested sicnce it's not React-aware.
  // It will be tested via e2e tests.
  /* istanbul ignore next */
  componentDidMount() {
    const quillOptions = {
      format: ["blockquote", "bold", "header", "italic", "link", "list", "underline"],
      modules: {
        toolbar: {
          container: this.$toolbar,
          handlers: {
            redo: () => this.quill.history.redo(),
            undo: () => this.quill.history.undo()
          }
        }
      },

      theme: "snow"
    };

    // We have to load Quill here because of the global `document`
    // variable check done by the original library.
    const Quill = require("quill");
    this.quill = new Quill(this.$editor, quillOptions);
    this.quill.on("text-change", this.onChange.bind(this));

    this.quill.focus();
  }

  // Quill can't be tested in unit tests sicnce it's not React-aware.
  // It will be tested via e2e tests.
  /* istanbul ignore next */
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
      <Flex flexDirection="column" ref={el => (this.$container = el)} {...props}>
        <div className="ql-toolbar ql-snow" ref={el => (this.$toolbar = el)}>
          <span className="ql-formats">
            <TextButton
              className="ql-undo"
              title="Bouton annulant la dernière modification effectuée"
              type="button"
            >
              <TextButtonIcon src="/static/images/undo.svg" />
            </TextButton>
            <TextButton
              className="ql-redo"
              title="Bouton réappliquant la dernière modification annulée"
              type="button"
            >
              <TextButtonIcon src="/static/images/redo.svg" />
            </TextButton>
          </span>
          <span className="ql-formats">
            <button
              className="ql-bold"
              title="Bouton formattant le texte sélectionné en gras"
              type="button"
            />
            <button
              className="ql-italic"
              title="Bouton formattant le texte sélectionné en italique"
              type="button"
            />
            <button
              className="ql-underline"
              title="Bouton formattant le texte sélectionné en souligné"
              type="button"
            />
          </span>
          <span className="ql-formats">
            <button
              className="ql-link"
              title="Bouton créant un lien à partir du text sélectionné"
              type="button"
            />
            <button
              className="ql-blockquote"
              title={`Bouton formattant le paragraphe sélectionné au format citation`}
              type="button"
            />
          </span>
          <span className="ql-formats">
            <button
              className="ql-list"
              title={`Bouton formattant le paragraphe sélectionné au format liste ordonnée`}
              value="ordered"
            />
            <button
              className="ql-list"
              title={`Bouton formattant le paragraphe sélectionné au format liste numérotée`}
              value="bullet"
            />
          </span>
          <span className="ql-formats">
            <select className="ql-header" defaultValue="">
              <option value="">Normal</option>
              <option value="2">Titre</option>
              <option value="3">Sous-titre</option>
            </select>
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
