import PropTypes from "prop-types";
import React from "react";
import ReactTagAutocomplete from "react-tag-autocomplete";
import { Flex } from "rebass";

import { LEGAL_REFERENCE_CATEGORY } from "../../constants";
import { Container } from "./index.style";
import Tag from "./Tag";

export function getReferences({ category, references, ...props }) {
  return references.map(({ dila_id, id, url, value }, index) => (
    <Tag
      category={category}
      dila_id={dila_id}
      id={id}
      key={String(index)}
      url={url}
      value={value}
      {...props}
    />
  ));
}

function LegalReferences({
  category,
  data = [],
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
        {getReferences({ category, isReadOnly, onChange, onRemove, references })}
      </Flex>
    </Container>
  );
}

LegalReferences.propTypes = {
  category: PropTypes.string,
  data: PropTypes.array,
  isReadOnly: PropTypes.bool,
  label: PropTypes.string,
  onAdd: PropTypes.func,
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  onRemove: PropTypes.func,
  references: PropTypes.array,
};

export default LegalReferences;
