import PropTypes from "prop-types";
import React from "react";
import { Flex } from "rebass";

import LegalReferenceProps from "../../props/LegalReference";
import { Container, Info } from "./index.style";
import Selector from "./Selector";
import Tag from "./Tag";

export function renderReferences({ references, ...globalProps }) {
  if (references.length === 0 && globalProps.isReadOnly) {
    return <Info data-testid="info">Aucune référence.</Info>;
  }

  return references.map((props, index) => (
    <Tag key={String(index)} {...{ ...globalProps, ...props }} />
  ));
}

function LegalReferences({
  category,
  data,
  idcc,
  isLoading = false,
  isReadOnly = false,
  onAdd,
  onChange,
  onIdccChange,
  onInput,
  onRemove,
  references,
  ...props
}) {
  if (isLoading) {
    return <Container {...props}>…</Container>;
  }

  if (category === null) {
    return (
      <Container {...props}>
        <Flex data-testid="list" flexDirection="column">
          {renderReferences({ isReadOnly, onChange, onRemove, references })}
        </Flex>
      </Container>
    );
  }

  return (
    <Container {...props}>
      {!isReadOnly && (
        <Selector
          category={category}
          data={data}
          idcc={idcc}
          onAdd={onAdd}
          onIdccChange={onIdccChange}
          onInput={onInput}
        />
      )}
      <Flex data-testid="list" flexDirection="column">
        {renderReferences({ isReadOnly, onChange, onRemove, references })}
      </Flex>
    </Container>
  );
}

LegalReferences.propTypes = {
  category: LegalReferenceProps.category,
  data: PropTypes.array,
  idcc: PropTypes.string,
  isLoading: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  onAdd: PropTypes.func,
  onChange: PropTypes.func,
  onIdccChange: PropTypes.func,
  onInput: PropTypes.func,
  onRemove: PropTypes.func,
  references: PropTypes.arrayOf(PropTypes.exact(LegalReferenceProps)),
};

export default LegalReferences;
