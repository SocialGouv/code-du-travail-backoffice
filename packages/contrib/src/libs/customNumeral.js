import numeral from "numeral";

numeral.register("locale", "fr", {
  delimiters: {
    thousands: " ",
    decimal: ","
  },
  abbreviations: {
    thousand: "k",
    million: "m",
    billion: "b",
    trillion: "t"
  },
  ordinal: function(number) {
    return number === 1 ? "er" : "ème";
  },
  currency: {
    symbol: "€"
  }
});

numeral.locale("fr");

export default numeral;
