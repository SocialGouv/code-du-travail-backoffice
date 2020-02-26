import PropTypes from "prop-types";
import React from "react";
import ReactTagAutocomplete from "react-tag-autocomplete";
import { Flex } from "rebass";

import { LEGAL_REFERENCE_TYPE } from "../../constants";
import { Container } from "./styles";
import Tag from "./Tag";

export function getReferences(references, onRemove, isReadOnly) {
  return references.map(({ id, value }, index) => (
    <Tag
      id={id}
      key={index}
      onRemove={!isReadOnly ? () => onRemove(id) : undefined}
      value={value}
    />
  ));
}

function LegalReferences({
  category,
  data = [],
  isReadOnly = false,
  onAdd = () => undefined,
  onInput = () => undefined,
  onRemove = () => undefined,
  references = [],
  ...props
}) {
  const placeholder =
    category === LEGAL_REFERENCE_TYPE.AGREEMENT ? "12, 36.3, 05.07.6…" : "D1234, L1234, R1234…";

  return (
    <Container {...props}>
      {!isReadOnly && (
        <ReactTagAutocomplete
          autofocus={false}
          handleAddition={onAdd}
          handleDelete={() => undefined}
          handleInputChange={onInput}
          handleValidate={() => true}
          maxSuggestionsLength={10}
          minQueryLength={1}
          placeholder={placeholder}
          suggestions={data}
          suggestionsFilter={() => true}
        />
      )}
      <Flex flexWrap="wrap">{getReferences(references, onRemove, isReadOnly)}</Flex>
    </Container>
  );
}

LegalReferences.propTypes = {
  data: PropTypes.array,
  isReadOnly: PropTypes.bool,
  label: PropTypes.string,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  references: PropTypes.array,
};

export default LegalReferences;
