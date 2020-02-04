import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

import _Button from "../../elements/Button";
import Icon from "../../elements/Icon";

const Container = styled(Flex)`
  border-left: solid 1px var(--color-light-steel-blue);
  margin-left: 1rem;
  padding: 0 1rem;
`;

const Text = styled.span`
  margin-left: 1rem;
`;
const Button = styled(_Button)`
  padding: 0 0 0 0.5rem;
`;

export default class AnswerEditionReferencesBlockList extends React.PureComponent {
  openUrl(url) {
    window.open(url, "_blank");
  }

  render() {
    const { ariaName, onRemove, references } = this.props;
    const urlButtonTitle = `Bouton ouvrant le lien associé à ${ariaName}`;

    return (
      <Container flexDirection="column">
        {references.map(({ url, value }, index) => (
          <Flex alignItems="center" key={index}>
            <Icon color="black" icon="circle" isSmall />
            <Text>{value}</Text>
            {typeof url === "string" && url.length !== 0 && (
              <Button
                icon="link"
                onClick={() => this.openUrl(url)}
                title={`${urlButtonTitle} "${value}"`}
              />
            )}
            <Button
              icon="trash"
              onClick={() => onRemove(value)}
              title={`Bouton supprimant ${ariaName} "${value}"`}
            />
          </Flex>
        ))}
      </Container>
    );
  }
}
