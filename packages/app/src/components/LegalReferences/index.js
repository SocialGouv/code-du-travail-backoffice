import PropTypes from "prop-types";
import React from "react";
import ReactTagAutocomplete from "react-tag-autocomplete";
import { Flex } from "rebass";

import { LEGAL_REFERENCE_CATEGORY } from "../../constants";
import { Container } from "./index.style";
import Tag from "./Tag";

export function getReferences({ references, ...globalProps }) {
  return references.map((props, index) => (
    <Tag key={String(index)} {...{ ...globalProps, ...props }} />
  ));
}

function LegalReferences({
  category,
  data = [],
  isEditable = false,
  isReadOnly = false,
  onAdd = () => undefined,
  onChange = () => undefined,
  onInput = () => undefined,
  onRemove = () => undefined,
  references = [],
  ...props
}) {
  const placeholder =
    category === LEGAL_REFERENCE_CATEGORY.AGREEMENT ? "12, 36.3, 05.07.6…" : "D1234, L1234, R1234…";

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
      <Flex flexDirection="column">
        {getReferences({ isEditable, isReadOnly, onChange, onRemove, references })}
      </Flex>
    </Container>
  );
}

LegalReferences.propTypes = {
  category: PropTypes.string,
  data: PropTypes.array,
  isEditable: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  onAdd: PropTypes.func,
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  onRemove: PropTypes.func,
  references: PropTypes.arrayOf(PropTypes.shape(Tag.propTypes)),
};

export default LegalReferences;
