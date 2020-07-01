import PropTypes from "prop-types";
import React from "react";
import ReactTagAutocomplete from "react-tag-autocomplete";

import LegalReferenceProps from "../../props/LegalReference";
import { Container, Input } from "./Selector.style";

const LEGAL_REFERENCE_CATEGORY_PLACEHOLDER = {
  agreement: "12, 36.3, 05.07.6…",
  labor_code: "D1234, L1234, R1234…",
};

class Selector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hasIdccError: false,
    };

    this.maybeChangeIdcc = this.maybeChangeIdcc.bind(this);
  }

  maybeChangeIdcc() {
    this.setState({ hasIdccError: false });

    const { onIdccChange } = this.props;
    const { value: idcc } = this.$idcc;

    if (!/^\d{4}$/.test(idcc)) {
      this.setState({ hasIdccError: true });

      return;
    }

    onIdccChange(idcc);
  }

  render() {
    const { category, data, idcc, onAdd, onInput } = this.props;
    const { hasIdccError } = this.state;
    const placeholder = LEGAL_REFERENCE_CATEGORY_PLACEHOLDER[category];

    return (
      <Container>
        {typeof idcc === "string" && (
          <Input
            data-testid="input-idcc"
            defaultValue={idcc}
            hasError={hasIdccError}
            maxLength={4}
            onChange={this.maybeChangeIdcc}
            ref={node => (this.$idcc = node)}
          />
        )}
        <ReactTagAutocomplete
          autofocus={false}
          data-testid="input-autocomplete"
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
      </Container>
    );
  }
}

Selector.propTypes = {
  category: LegalReferenceProps.category,
  data: PropTypes.array,
  idcc: PropTypes.string,
  onAdd: PropTypes.func,
  onIdccChange: PropTypes.func,
  onInput: PropTypes.func,
};

export default Selector;
