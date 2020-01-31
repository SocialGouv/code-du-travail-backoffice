import numeral from "numeral";

if (numeral.locale() === "en") {
  numeral.register("locale", "fr", {
    abbreviations: {
      billion: "b",
      million: "m",
      thousand: "k",
      trillion: "t"
    },
    currency: {
      symbol: "€"
    },
    delimiters: {
      decimal: ",",
      thousands: " "
    },
    ordinal: function(number) {
      return number === 1 ? "er" : "ème";
    }
  });

  numeral.locale("fr");
}

export default numeral;
