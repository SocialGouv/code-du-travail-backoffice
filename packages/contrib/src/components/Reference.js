import React from "react";
import { Flex } from "rebass/styled-components";
import styled from "styled-components";

import _Icon from "../elements/Icon";

const Container = styled(Flex)`
  background-color: var(--color-pearl);
  border: solid 1px var(--color-misty-moss);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  margin: 0.5rem 0.5rem 0 0;
  max-width: 32rem;
  padding: 0.2rem 0.4rem;
`;
const Text = styled.span`
  color: var(--color-black-leather-jacket);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const TextWithIcon = styled(Text)`
  margin-right: 0.5rem;
`;
const Icon = styled(_Icon)`
  margin-left: 0.25rem;

  :hover {
    color: var(--color-black-leather-jacket);
  }
`;

const DEFAULT_PROPS = {
  isDisabled: false
};

export default class extends React.PureComponent {
  openUrl(url) {
    window.open(url, "_blank");
  }

  render() {
    const { isDisabled, onRemove, url, value } = {
      ...DEFAULT_PROPS,
      ...this.props
    };

    return (
      <Container alignItems="center">
        {isDisabled && (typeof url !== "string" || url.length === 0) && <Text>{value}</Text>}
        {(!isDisabled || (typeof url === "string" && url.length !== 0)) && (
          <TextWithIcon>{value}</TextWithIcon>
        )}
        {typeof url === "string" && url.length !== 0 && (
          <Icon
            color="var(--color-shadow)"
            icon="link"
            onClick={() => this.openUrl(url)}
            role="button"
            title={`Bouton ouvrant l'url de la référence "${value}"`}
          />
        )}
        {!isDisabled && (
          <Icon
            color="var(--color-shadow)"
            icon="trash"
            onClick={() => onRemove(value)}
            role="button"
            title={`Bouton supprimant la référence "${value}"`}
          />
        )}
      </Container>
    );
  }
}
