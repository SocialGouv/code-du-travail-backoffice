import React from "react";
// import { Flex } from "rebass/styled-components";
import styled from "styled-components";

import Main from "../src/layouts/Main";

const IFrame = styled.iframe`
  flex-grow: 1;
`;

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
  }

  render() {
    if (this.state.isLoading) return <Main isLoading />;

    return (
      <Main>
        <IFrame
          frameBorder="0"
          src="/static/docs/Charte-Redactionnelle-v2019.05.pdf"
          scrolling="no"
          title="Charte rédactionnelle"
        />
      </Main>
    );
  }
}
