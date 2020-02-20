import moment from "moment-timezone";

// https://momentjs.com/docs/#/customization/relative-time/
moment.updateLocale("en", {
  relativeTime: {
    M: "un mois",
    MM: "%d mois",
    d: "un jour",
    dd: "%d jours",
    future: "dans %s",
    h: "une heure",
    hh: "%d heures",
    m: "a minute",
    mm: "%d minutes",
    past: "il y a %s",
    s: "quelques secondes",
    ss: "%d secondes",
    y: "un an",
    yy: "%d ans",
  },
});

export default moment;
