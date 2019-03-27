import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import deleteIconUri from "../../images/delete.svg";
import linkIconUri from "../../images/link.svg";

const Container = styled(Flex)`
  background-color: lightgray;
  border: solid 1px gray;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  margin: 0.5rem 0.5rem 0 0;
  padding: 0.2rem 0.4rem;
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

export default class extends React.PureComponent {
  openUrl(url) {
    window.open(url, "_blank");
  }

  render() {
    const { onRemove, url, value } = this.props;

    return (
      <Container alignItems="center">
        {value}
        {typeof url === "string" && (
          <Button
            alt={`Bouton ouvrant l'url de la référence juridique ${value}`}
            onClick={() => this.openUrl(url)}
            src={linkIconUri}
          />
        )}
        <Button
          alt={`Bouton supprimant la référence juridique ${value}`}
          onClick={() => onRemove(value)}
          src={deleteIconUri}
        />
      </Container>
    );
  }
}
