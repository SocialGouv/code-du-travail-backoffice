import React, { useState } from "react";

import FuseInput from "../../lib/FuseInput";
import ListRecords from "../../kinto/ListRecords";
import fuseInputTheme from "./fuseInputTheme";

const getSuggestionValue = suggestion =>
  (suggestion.item && suggestion.item.title) || "";

const PARENT_MAX_LENGTH = 15;

const trimTitle = (item, index, all) => {
  if (
    all.length > 1 &&
    index < all.length - 1 &&
    item.length > PARENT_MAX_LENGTH
  ) {
    return item.substring(0, PARENT_MAX_LENGTH) + "...";
  }
  return item;
};

const makeTitle = (themes, leafTheme) => {
  const titles = [];
  let theme = leafTheme;
  while (theme && theme.parent) {
    theme = themes.find(t => t.id === theme.parent);
    if (theme) {
      titles.unshift(theme.title);
    }
  }
  titles.push(leafTheme.title);

  return titles.map(trimTitle).join(" > ");
};

const FuseThemePicker = props => (
  <ListRecords
    bucket="datasets"
    collection="themes"
    render={({ result }) => {
      const currentTheme =
        result && result.data.find(t => t.id === props.value);
      const resultsWithParents = result.data.map(r => ({
        ...r,
        fullTitle: makeTitle(result.data, r)
      }));
      return (
        <FuseInput
          theme={fuseInputTheme}
          data={[{ id: null, title: "Aucun" }].concat(resultsWithParents)}
          placeholder="Choisissez le thème"
          labelKey="fullTitle"
          getSuggestionValue={getSuggestionValue}
          {...props}
          value={(currentTheme && currentTheme.title) || ""}
        />
      );
    }}
  />
);

const LazyThemePicker = props => {
  const [editing, setEditing] = useState();
  const onChangeTheme = theme => {
    props.onChange(theme);
    setEditing(false);
  };
  return (
    <React.Fragment>
      {editing ? (
        <FuseThemePicker {...props} onChange={onChangeTheme} />
      ) : (
        <div style={props.style} onClick={() => setEditing(true)}>
          {props.title}
        </div>
      )}
    </React.Fragment>
  );
};

const ThemePicker = props => {
  if (props.lazy) {
    return <LazyThemePicker {...props} />;
  }
  return <FuseThemePicker {...props} />;
};

export default ThemePicker;
