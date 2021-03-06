// import { Flex } from "rebass";
import styled from "@emotion/styled";
import React from "react";

import Main from "../src/layouts/Main";

const IFrame = styled.iframe`
  flex-grow: 1;
`;

export default class CharterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
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
          scrolling="no"
          src="/static/docs/Charte-Redactionnelle-v2019.05.pdf"
          title="Charte rédactionnelle"
        />
      </Main>
    );
  }
}
