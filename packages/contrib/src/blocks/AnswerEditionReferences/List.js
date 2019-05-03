import React from "react";
import { Flex } from "rebass";
import styled from "styled-components";

import Button from "../../elements/Button";
import Icon from "../../elements/Icon";

const Container = styled(Flex)`
  border-left: solid 1px var(--color-light-steel-blue);
  margin-left: 1rem;
  padding: 0 1rem;
`;
const Text = styled.span`
  margin-left: 1rem;
`;

export default class List extends React.PureComponent {
  openUrl(url) {
    window.open(url, "_blank");
  }

  render() {
    return (
      <Container flexDirection="column">
        {this.props.references.map(({ url, value }, index) => (
          <Flex alignItems="center" key={index}>
            <Icon color="black" icon="circle" isSmall />
            <Text>{value}</Text>
            {typeof url === "string" && url.length !== 0 && (
              <Button
                icon="link"
                onClick={() => this.openUrl(url)}
                title={`Bouton ouvrant le lien associé à ${
                  this.props.ariaName
                } : ${value}`}
              />
            )}
            <Button
              icon="trash"
              onClick={() => this.props.onRemove(value)}
              title={`Bouton supprimant ${this.props.ariaName} : ${value}`}
            />
          </Flex>
        ))}
      </Container>
    );
  }
}
