import moment from "moment-timezone";

// https://momentjs.com/docs/#/customization/relative-time/
moment.updateLocale("en", {
  relativeTime: {
    future: "dans %s",
    past: "il y a %s",
    s: "quelques secondes",
    ss: "%d secondes",
    m: "a minute",
    mm: "%d minutes",
    h: "une heure",
    hh: "%d heures",
    d: "un jour",
    dd: "%d jours",
    M: "un mois",
    MM: "%d mois",
    y: "un an",
    yy: "%d ans"
  }
});

export default moment;
