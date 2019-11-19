// see https://github.com/moroshko/react-autosuggest#themeProp
const fuseInputTheme = {
  container: {
    flex: "1 1 100%",
    textAlign: "left",
    border: 0,
    position: "relative"
  },
  suggestionsList: {
    width: 800,
    margin: 0,
    padding: 0,
    marginTop: ".5em",
    paddingTop: "0",
    border: "1px solid silver",
    borderRadius: "3px",
    background: "white",
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
    boxShadow: "0 10px 10px -10px #b7bcdf"
  },
  suggestion: {
    listStyleType: "none",
    borderRadius: "3px",
    padding: 5,
    lineHeight: "2rem",
    cursor: "pointer"
  },
  suggestionHighlighted: {
    background: "#eee"
  }
};

export default fuseInputTheme;
