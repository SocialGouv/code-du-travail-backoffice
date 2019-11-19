import memoizee from "memoizee";

const API_URL =
  "https://api.code-du-travail-numerique.incubateur.social.gouv.fr/api/v1";
//"https://cdtn-api.num.social.gouv.fr/api/v1";
//"https://api.code-du-travail-numerique.incubateur.social.gouv.fr/api/v1";

const sortByRelevance = (a, b) => {
  if (a._source._score < b._source._score) {
    return 1;
  } else if (a._source._score > b._source._score) {
    return -1;
  }
  return 0;
};

const fetchResults = endpoint => (query = "", excludeSources = "") => {
  const url = `${API_URL}/${endpoint}?q=${encodeURIComponent(
    query
  )}&excludeSources=${encodeURIComponent(excludeSources)}&size=25`;
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Un problème est survenu.");
    })
    .then(data => {
      return [...data.documents, ...data.articles, ...data.themes]
        .map(result => ({
          _source: result
        }))
        .sort(sortByRelevance)
        .slice(0, 25);
    });
};
const searchResults = fetchResults("search");
const suggestResults = fetchResults("suggest");

const suggestMin = (query, excludeSources) => {
  if (query.length > 2) {
    return suggestResults(query, excludeSources);
  } else {
    return Promise.resolve({ hits: { hits: [] } });
  }
};

// memoize search results
const searchResultsMemoized = memoizee(searchResults, {
  promise: true,
  length: 2 // ensure memoize work for function with es6 default params
});

// memoize suggestions results
const suggestResultsMemoized = memoizee(suggestMin, {
  promise: true,
  length: 2 // ensure memoize work for function with es6 default params
});

export {
  suggestResultsMemoized as suggestResults,
  searchResultsMemoized as searchResults
};
