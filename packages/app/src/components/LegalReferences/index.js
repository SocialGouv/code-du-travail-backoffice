import PropTypes from "prop-types";
import React from "react";
import ReactTagAutocomplete from "react-tag-autocomplete";
import { Flex } from "rebass";

import LegalReferenceProps from "../../props/LegalReference";
import { Container } from "./index.style";
import Tag from "./Tag";

const LEGAL_REFERENCE_CATEGORY_PLACEHOLDER = {
  agreement: "12, 36.3, 05.07.6…",
  labor_code: "D1234, L1234, R1234…",
};

export function renderReferences({ references, ...globalProps }) {
  return references.map((props, index) => (
    <Tag key={String(index)} {...{ ...globalProps, ...props }} />
  ));
}

function LegalReferences({
  category,
  data = [],
  isEditable = false,
  isLoading = false,
  isReadOnly = false,
  onAdd = () => undefined,
  onChange = () => undefined,
  onInput = () => undefined,
  onRemove = () => undefined,
  references = [],
  ...props
}) {
  if (isLoading) {
    return <Container {...props}>…</Container>;
  }

  if (category === null) {
    return (
      <Container {...props}>
        <Flex flexDirection="column">
          {renderReferences({ isEditable, isReadOnly, onChange, onRemove, references })}
        </Flex>
      </Container>
    );
  }

  const placeholder = LEGAL_REFERENCE_CATEGORY_PLACEHOLDER[category];

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
        {renderReferences({ isEditable, isReadOnly, onChange, onRemove, references })}
      </Flex>
    </Container>
  );
}

LegalReferences.propTypes = {
  category: LegalReferenceProps.category,
  data: PropTypes.array,
  isEditable: PropTypes.bool,
  isLoading: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  onAdd: PropTypes.func,
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  onRemove: PropTypes.func,
  references: PropTypes.arrayOf(PropTypes.shape(LegalReferenceProps)),
};

export default LegalReferences;
