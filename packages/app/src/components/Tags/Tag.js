import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

const Container = styled(Flex)`
  background-color: lightgray;
  border: solid 1px gray;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  margin: 0.5rem 0.5rem 0 0;
  max-width: 32rem;
  padding: 0.2rem 0.4rem;
  user-select: none;
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

export default class Tag extends React.PureComponent {
  openUrl(url) {
    window.open(url, "_blank");
  }

  render() {
    const { onRemove, url, value } = this.props;
    const ariaName = this.props.ariaName !== undefined ? this.props.ariaName : "l'étiquette";

    return (
      <Container alignItems="center">
        <Text>{value}</Text>
        {typeof url === "string" && (
          <Button
            alt={`Bouton ouvrant l'url de ${ariaName} ${value}`}
            onClick={() => this.openUrl(url)}
            src="/static/images/link.svg"
          />
        )}
        <Button
          alt={`Bouton supprimant ${ariaName} ${value}`}
          onClick={() => onRemove(value)}
          src="/static/images/delete.svg"
        />
      </Container>
    );
  }
}
