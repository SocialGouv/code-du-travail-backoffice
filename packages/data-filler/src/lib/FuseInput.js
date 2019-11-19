import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import Fuse from "fuse.js";
import getSlug from "speakingurl";

import styled from "styled-components";

const DEFAULT_FUSE_OPTIONS = {
  shouldSort: true,
  tokenize: true,
  matchAllTokens: true,
  includeMatches: true,
  findAllMatches: true,
  includeScore: true,
  threshold: 0.75,
  location: 0,
  distance: 100,
  maxPatternLength: 20,
  minMatchCharLength: 3,
  keys: ["labelNormalized"]
};

// normalize strings for i18n
const normalize = str =>
  getSlug(str, {
    separator: " ",
    mark: true,
    lang: "fr",
    uric: true,
    uricNoSlash: true,
    maintainCase: true
  }).toLowerCase();

const SuggestionContainer = styled.div`
  p {
    margin: 0;
  }
  .fuse-highlighter {
    padding: 0;
    background: yellow;
  }
`;

// render a highlighted html with span.fuse-highlighter from a fuse.js suggestion and a query.
const FuseHighLighter = ({ suggestion, query, style, labelKey }) => {
  let html = suggestion.item[labelKey];
  let offset = 0;
  let newHtml;

  if (html) {
    suggestion.matches.forEach(match => {
      match.indices.forEach(indice => {
        if (indice[1] - indice[0] > 1) {
          newHtml = html.slice(0, indice[0] + offset);
          newHtml += `<span class="fuse-highlighter">`;
          newHtml += html.slice(indice[0] + offset, indice[1] + offset + 1);
          newHtml += `</span>`;
          newHtml += html.slice(indice[1] + offset + 1);
          offset += newHtml.length - html.length;
          html = newHtml;
        }
      });
    });
    return (
      <SuggestionContainer
        style={style}
        dangerouslySetInnerHTML={{
          __html: newHtml || html
        }}
      />
    );
  }
  return <div>{html}</div>;
};

const renderSuggestion = (query, labelKey) => suggestion => (
  <FuseHighLighter query={query} suggestion={suggestion} labelKey={labelKey} />
);

class FuseInput extends React.Component {
  state = {
    value: "",
    suggestions: []
  };
  componentDidMount() {
    const data = this.props.data.map(d => ({
      ...d,
      labelNormalized: normalize(d[this.props.labelKey])
    }));
    this.fuse = new Fuse(data, DEFAULT_FUSE_OPTIONS);
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  }
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const getSuggestions = value =>
      this.fuse
        .search(normalize(value))
        .filter(q => q.matches.length)
        .slice(0, 25);
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSelect = (event, { suggestion, suggestionValue }) => {
    this.setState(
      {
        value: (suggestion.item && suggestion.item[this.props.labelKey]) || ""
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(suggestion.item);
        }
      }
    );
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      value, //: this.props.getSuggestionValue(value),
      type: "search",
      onChange: this.onChange,
      placeholder: this.props.placeholder
    };
    return (
      <Autosuggest
        theme={this.props.theme}
        highlightFirstSuggestion={false}
        focusInputOnSuggestionClick={false}
        suggestions={suggestions}
        onSuggestionSelected={this.onSelect}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        renderSuggestion={renderSuggestion(value, this.props.labelKey)}
        renderInputComponent={renderInputComponent}
        renderSuggestionsContainer={renderSuggestionsContainer}
        inputProps={inputProps}
        {...this.props}
      />
    );
  }
}

import { Input } from "reactstrap";

const renderInputComponent = inputProps => (
  <Input {...inputProps} innerRef={inputProps.ref} />
);

const SuggestionsContainer = styled.div`
  white-space: nowrap;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  text-overflow: ellipsis;
  width: 90%;
  overflow: hidden;

  ul {
    position: absolute;
    z-index: 99999;
  }
  li[role="option"]:nth-child(2n + 1) {
    background: #f7f7f7;
  }
`;

const renderSuggestionsContainer = ({ containerProps, children }) => (
  <SuggestionsContainer {...containerProps}>{children}</SuggestionsContainer>
);

FuseInput.propTypes = {
  placeholder: PropTypes.string,
  labelKey: PropTypes.string,
  data: PropTypes.array.isRequired,
  getSuggestionValue: PropTypes.func
};

FuseInput.defaultProps = {
  labelKey: "label",
  getSuggestionValue: suggestion => suggestion.id
};

export default FuseInput;
