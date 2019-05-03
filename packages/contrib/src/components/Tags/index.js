import { any, prop, propEq, sortBy } from "ramda";
import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Input from "../../elements/Input";
import stringFrIncludes from "../../libs/stringFrIncludes";
import Tag from "./Tag";

const Container = styled(Flex)`
  flex-grow: 1;
`;
const SelectedTags = styled(Flex)`
  flex-wrap: wrap;
`;
const SuggestedTags = styled(Flex)`
  background-color: var(--color-pearl);
  border: solid 1px var(--color-misty-moss);
  border-bottom: 0;
  margin-top: 2.25rem;
  max-width: 32rem;
  position: absolute;
  user-select: none;
  z-index: 1;
`;
const SuggestedTagsRow = styled.div`
  border-bottom: solid 1px var(--color-misty-moss);
  cursor: pointer;
  font-size: 0.875rem;
  overflow: hidden;
  padding: 0.25rem 0.5rem;
  text-overflow: ellipsis;
  white-space: nowrap;

  :hover {
    background-color: var(--color-shadow);
    color: white;
  }
`;

export default class Tags extends React.PureComponent {
  constructor(props) {
    super(props);

    const tags =
      props.tags !== undefined
        ? this.sortByValue(
            props.tags.filter(
              ({ value }) => !any(propEq("value", value))(props.selectedTags)
            )
          )
        : [];

    this.state = {
      inputKey: 0,
      isLoading: true,
      selectedTags:
        props.selectedTags !== undefined
          ? this.sortByValue(props.selectedTags)
          : [],
      suggestedTags: [],
      tags
    };

    this.ariaName =
      this.props.ariaName !== undefined ? this.props.ariaName : "l'étiquette";
  }

  getTagByValue(_value, source) {
    return source.filter(({ value }) => value === _value)[0];
  }

  sortByValue(source) {
    return sortBy(prop("value"))(source);
  }

  addTag(_value) {
    const tag = this.getTagByValue(_value, this.state.tags);

    this.setState({
      inputKey: this.state.inputKey + 1,
      selectedTags: this.sortByValue([...this.state.selectedTags, tag]),
      suggestedTags: [],
      tags: this.state.tags.filter(({ value }) => value !== _value)
    });

    this.props.onAdd(tag);
  }

  removeTag(value) {
    const foundTag = this.getTagByValue(value, this.state.selectedTags);
    const tag = foundTag !== undefined ? foundTag : { value };

    this.setState({
      selectedTags: this.state.selectedTags.filter(
        ({ value: _value }) => _value !== value
      ),
      tags: this.sortByValue([...this.state.tags, tag])
    });

    this.props.onRemove(tag);
  }

  refreshSuggestedTags() {
    if (this.state.tags.length === 0) return;

    if (this.$input.value.length === 0) {
      this.setState({ suggestedTags: [] });

      return;
    }

    this.setState({
      suggestedTags: this.state.tags
        .filter(({ value }) => stringFrIncludes(this.$input.value, value))
        .slice(0, 9)
    });
  }

  getSuggestedTags() {
    return this.state.suggestedTags.map(({ value }, index) => (
      <SuggestedTagsRow key={index} onClick={() => this.addTag(value)}>
        {value}
      </SuggestedTagsRow>
    ));
  }

  getSelectedTags() {
    const selectedTags = Boolean(this.props.isEditable)
      ? this.state.selectedTags
      : this.props.selectedTags;

    return selectedTags.map((tag, index) => (
      <Tag
        ariaName={this.ariaName}
        key={index}
        onRemove={this.removeTag.bind(this)}
        url={tag.url}
        value={tag.value}
      />
    ));
  }

  render() {
    return (
      <Container flexDirection="column">
        {Boolean(this.props.isEditable) && (
          <Input
            key={this.state.inputKey}
            onChange={this.refreshSuggestedTags.bind(this)}
            placeholder={`Commencez à taper le nom de ${this.ariaName}`.replace(
              "de le",
              "du"
            )}
            ref={node => (this.$input = node)}
          />
        )}
        {Boolean(this.props.isEditable) &&
          this.state.suggestedTags.length !== 0 && (
            <SuggestedTags flexDirection="column">
              {this.getSuggestedTags()}
            </SuggestedTags>
          )}
        {!Boolean(this.props.hideTags) && (
          <SelectedTags>{this.getSelectedTags()}</SelectedTags>
        )}
      </Container>
    );
  }
}
