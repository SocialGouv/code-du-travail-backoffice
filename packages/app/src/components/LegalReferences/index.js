import PropTypes from "prop-types";
import React from "react";
import ReactTagAutocomplete from "react-tag-autocomplete";
import { Flex } from "rebass";

import Tag from "../Tags/Tag";
import { Container } from "./styles";

export function getReferences(references, onRemove) {
  return references.map(({ id, value }, index) => (
    <Tag key={index} onRemove={() => onRemove(id)} value={value} />
  ));
}

function LegalReferences({
  data = [],
  isReadOnly = false,
  label = "",
  onAdd = () => undefined,
  onInput = () => undefined,
  onRemove = () => undefined,
  references = [],
}) {
  return (
    <Container>
      {!isReadOnly && (
        <ReactTagAutocomplete
          autofocus={false}
          handleAddition={onAdd}
          handleDelete={() => undefined}
          handleInputChange={onInput}
          handleValidate={() => true}
          maxSuggestionsLength={10}
          minQueryLength={1}
          placeholder={label}
          suggestions={data}
          suggestionsFilter={() => true}
        />
      )}
      <Flex flexWrap="wrap">{getReferences(references, onRemove)}</Flex>
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
