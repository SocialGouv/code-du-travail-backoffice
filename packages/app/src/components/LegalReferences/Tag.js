import styled from "@emotion/styled";
import React from "react";
import ReactTooltip from "react-tooltip";
import { Flex } from "rebass";

import customAxios from "../../libs/customAxios";

const Container = styled(Flex)`
  background-color: var(--color-alice-blue);
  border: solid 1px var(--color-border);
  cursor: help;
  font-size: 0.875rem;
  margin: 0.5rem 0.5rem 0 0;
  max-width: 32rem;
  padding: 0.2rem 0.4rem;
  user-select: none;

  :hover {
    background-color: var(--color-periwinkle);
  }
`;

const Tooltip = styled(ReactTooltip)`
  background-color: white !important;
  border: solid 1px var(--color-border);
  box-shadow: 0 0 0.25rem var(--color-border);
  max-height: 40%;
  max-width: 34rem;
  opacity: 1 !important;
  overflow-y: auto;
  padding: 0.25rem 0.5rem 0.45rem;
  white-space: pre;
`;

const Text = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Button = styled.img`
  cursor: pointer;
  height: 0.75rem;
  margin-left: 0.5rem;
  opacity: 0.5;
  vertical-align: 2px;
  width: 0.75rem;

  :hover {
    opacity: 1;
  }
`;

const BASE_URL = "https://beta.legifrance.gouv.fr/conv_coll/id/";

export default class Tag extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tip: "",
    };
  }

  componentDidMount() {
    const { value } = this.props;

    if (value.startsWith("KALIARTI") || value.startsWith("LEGIARTI")) {
      this.loadTip();
    }
  }

  openUrl() {
    const { value } = this.props;

    window.open(`${BASE_URL}${value}`, "_blank");
  }

  async loadTip() {
    const { value } = this.props;

    const { data: tip } = await customAxios().get(`/legal-references/${value}`);

    this.setState({ tip });
  }

  render() {
    const { id, onRemove, value } = this.props;
    const { tip } = this.state;

    return (
      <Container alignItems="center" data-for={id} data-tip={tip}>
        <Text>{value}</Text>
        {tip.length !== 0 && (
          <Button onClick={this.openUrl.bind(this)} src="/static/images/link.svg" />
        )}
        {onRemove !== undefined && (
          <Button onClick={() => onRemove(value)} src="/static/images/delete.svg" />
        )}
        {tip.length !== 0 && (
          <Tooltip
            clickable={true}
            delayHide={250}
            effect="solid"
            id={id}
            place="bottom"
            type="light"
          />
        )}
      </Container>
    );
  }
}
