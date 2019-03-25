import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import BaseTagsBar from "./TagsBar";
import BaseEditor from "../../components/Editor";

const Container = styled(Flex)`
  flex-grow: 1;
`;
const Editor = styled(BaseEditor)`
  flex-grow: 1;
`;
const TagsBar = styled(BaseTagsBar)`
  max-width: 22rem;
`;

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isTagsBarOpen: false
    };
  }

  toggleTagsBar() {
    this.setState({ isTagsBarOpen: !this.state.isTagsBarOpen });
  }

  render() {
    return (
      <Container>
        <Editor
          defaultValue={this.props.defaultValue}
          onChange={this.props.onChange}
          onTagsClicked={() => this.toggleTagsBar()}
        />
        {this.state.isTagsBarOpen && (
          <TagsBar
            flexDirection="column"
            onToggleTag={this.props.onToggleTag}
            selectedTags={this.props.selectedTags}
            tags={this.props.tags}
          />
        )}
      </Container>
    );
  }
}
