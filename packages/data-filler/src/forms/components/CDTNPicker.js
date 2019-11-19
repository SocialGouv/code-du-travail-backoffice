import React from "react";
import Autosuggest from "react-autosuggest";
import styled from "styled-components";

import { Input } from "reactstrap";

import { getLabelBySource } from "../../sources";
import { searchResults } from "../../cdtn-api";

import fuseInputTheme from "./fuseInputTheme";

const isExternalUrl = url => url.match(/^https?:\/\//);

// handle query + results state
class SuggestionState extends React.Component {
  state = { query: this.props.query, hits: [] };
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ query: nextProps.query, hits: [] });
  }
  updateQuery = query => {
    // dont fetch suggestions for urls
    if (isExternalUrl(query)) {
      this.setState({ query, hits: [] });
    } else {
      this.setState({ query, hits: [] }, () => {
        this.props
          .fetchSuggestions(query)
          .then(hits => this.setState({ hits }));
      });
    }
  };
  render() {
    return this.props.render({
      query: this.state.query,
      hits: this.state.hits,
      updateQuery: this.updateQuery,
      forceUpdate: this.forceUpdate.bind(this)
    });
  }
}

const renderInputComponent = inputProps => (
  <Input {...inputProps} innerRef={inputProps.ref} />
);

const getSuggestionValue = suggestion =>
  `${suggestion._source.source}/${suggestion._source.id}`;

export const CDTNPicker = ({ query, onSelect }) => {
  const originalQuery = query;
  return (
    <SuggestionState
      fetchSuggestions={searchResults}
      query={originalQuery}
      render={({ query, hits, updateQuery, forceUpdate }) => {
        const _onChange = () => {};
        const _onSearch = e => {
          updateQuery(e.value);
        };
        const _onSelect = (event, data) => {
          onSelect(data.suggestion);
          forceUpdate();
        };
        const _onClear = () => {
          updateQuery(originalQuery);
        };
        const _onBlur = e => {
          // note: if we pasted some external url, send it as if it was a suggestion
          if (e.target && e.target.value && isExternalUrl(e.target.value)) {
            onSelect({
              _source: { url: e.target.value }
            });
          }
        };
        const inputProps = {
          name: "query",
          placeholder: "ex: L4212",
          type: "search",
          value: query,
          onChange: _onChange,
          onBlur: _onBlur
        };
        return (
          <Autosuggest
            theme={fuseInputTheme}
            suggestions={hits}
            focusInputOnSuggestionClick={false} // prevent some ref issues
            alwaysRenderSuggestions={false}
            onSuggestionSelected={_onSelect}
            onSuggestionsFetchRequested={_onSearch}
            onSuggestionsClearRequested={_onClear}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            renderSuggestionsContainer={renderSuggestionsContainer}
            renderInputComponent={renderInputComponent}
            inputProps={inputProps}
          />
        );
      }}
    />
  );
};

const cleanHtml = html =>
  html
    .trim()
    .replace(/^(<br\/?>)+/, "")
    .replace(/((<br\/?>)+)$/, "")
    .replace(/^(<p>)+/, "")
    .replace(/((<\/p>)+)$/, "");

const SuggestionContainer = styled.div`
  p {
    margin: 0;
  }
`;

const renderSuggestion = suggestion => {
  const source = getLabelBySource(suggestion._source.source);
  return (
    <SuggestionContainer>
      <b>{source ? `${source} | ` : ""}</b> {suggestion._source.title}
      <br />
      <div
        dangerouslySetInnerHTML={{
          __html: cleanHtml(
            (suggestion.highlight &&
              suggestion.highlight["all_text.french_exact"] &&
              suggestion.highlight["all_text.french_exact"][0]) ||
              ""
          )
        }}
      />
    </SuggestionContainer>
  );
};

const SuggestionsContainer = styled.div`
  white-space: nowrap;
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

export default CDTNPicker;
