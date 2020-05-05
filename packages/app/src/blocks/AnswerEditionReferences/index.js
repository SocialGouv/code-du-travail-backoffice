import styled from "@emotion/styled";
import React from "react";
import { Flex } from "rebass";

import LegalReferences from "../../components/LegalReferences";
import Subtitle from "../../elements/Subtitle";

const Container = styled(Flex)`
  flex-grow: 1;
  padding: 1rem;
`;

const AnswerEditionReferences = ({ onAdd, onRemove, references }) => {
  const agreementReferences = references.filter(({ category }) => category === "agreement");
  const laborCodeReferences = references.filter(({ category }) => category === "labor_code");
  const otherReferences = references.filter(({ category }) => category === null);

  return (
    <Container flexDirection="column">
      <Subtitle isFirst>Articles de convention collective :</Subtitle>
      <LegalReferences
        category="agreement"
        onAdd={onAdd}
        onRemove={onRemove}
        references={agreementReferences}
      />
      <Subtitle>Articles du Code du travail :</Subtitle>
      <LegalReferences
        category="labor_code"
        onAdd={onAdd}
        onRemove={onRemove}
        references={laborCodeReferences}
      />
      <Subtitle>
        Autres références juridiques (décret, règlementation, circulaire, jurisprudence) :
      </Subtitle>
      <LegalReferences
        category={null}
        onAdd={onAdd}
        onRemove={onRemove}
        references={otherReferences}
      />
    </Container>
  );
};

export default AnswerEditionReferences;
