import React from "react";
import { Flex } from "rebass";
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
  user-select: none;
`;
const Text = styled.span`
  color: var(--color-black-leather-jacket);
  margin-right: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Icon = styled(_Icon)`
  :hover {
    color: var(--color-black-leather-jacket);
  }
`;
const UrlIcon = styled(Icon)`
  margin-right: 0.25rem;
`;

export default class extends React.PureComponent {
  openUrl(url) {
    window.open(url, "_blank");
  }

  render() {
    const { onRemove, url, value } = this.props;

    return (
      <Container alignItems="center">
        <Text>{value}</Text>
        {typeof url === "string" && url.trim().length !== 0 && (
          <UrlIcon
            color="var(--color-shadow)"
            icon="link"
            onClick={() => this.openUrl(url)}
            role="button"
            title={`Bouton ouvrant l'url de la référence "${value}"`}
          />
        )}
        <Icon
          color="var(--color-shadow)"
          icon="trash"
          onClick={() => onRemove(value)}
          role="button"
          title={`Bouton supprimant la référence "${value}"`}
        />
      </Container>
    );
  }
}
