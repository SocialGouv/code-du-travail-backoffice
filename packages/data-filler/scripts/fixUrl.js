const fuzz = require("fuzzball");

const data = require("../src/dump.data.json");

const fichesMT = data.filter(rec => rec.source === "fiches_ministere_travail");
const fichesSP = data.filter(rec => rec.source === "fiches_service_public");
const themes = data.filter(rec => rec.source === "themes");
const contributions = data.filter(rec => rec.source === "contributions");
const modeles = data.filter(rec => rec.source === "modeles_de_courriers");

const FUZZ_RATIO = 90;

const findFicheMTBySlug = slug => {
  const results = fuzz.extract(
    slug,
    data.filter(r => r.source === "fiches_ministere_travail"),
    {
      scorer: fuzz.ratio,
      processor: choice => choice.slug,
      cutoff: FUZZ_RATIO,
      limit: 1
    }
  );
  if (results.length) {
    return results[0][0].slug;
  }
};

const logFix = (original, fixed) => {
  console.log(`Fixed | ${original} | ${fixed}`);
};

const findFicheMTByAnchor = slug => {
  const results = fuzz.extract(
    slug,
    data
      .filter(r => r.source === "fiches_ministere_travail")
      .filter(r => r.anchor),
    {
      scorer: fuzz.ratio,
      processor: choice => choice.anchor,
      cutoff: FUZZ_RATIO,
      limit: 1
    }
  );
  if (results.length) {
    //console.log("ANCHOR", slug);
    return results[0][0].slug;
  }
};

const findModeleBySlug = slug => {
  const results = fuzz.extract(
    slug,
    data.filter(r => r.source === "modeles_de_courriers"),
    {
      scorer: fuzz.ratio,
      processor: choice => choice.slug,
      cutoff: FUZZ_RATIO,
      limit: 1
    }
  );
  if (results.length) {
    //console.log("MODELE", slug);
    return results[0][0].slug;
  }
};

const fixUrl = url => {
  if (url.match(/^https?:\/\//)) {
    if (
      url.includes("code.travail.gouv.fr") ||
      url.includes("code-du-travail-numerique")
    ) {
      // keep relative path and anchor only
      url = url.replace(
        /^https?:\/\/[^/]+\/([^?]+)(?:\?[^#]+)?(#.*)?/gis,
        "/$1$2"
      );
    } else {
      //external urls
      return url;
    }
  }
  if (url.match(/^\/code-du-travail\//)) {
    return url;
  }
  if (url.match(/^\/outils\//)) {
    return url;
  }
  const modeleMatch = url.match(/^\/modeles-de-courriers\/([^/#]+)/);
  if (modeleMatch) {
    const found = modeles.find(fiche => fiche.slug === modeleMatch[1]);
    if (found) {
      return url;
    } else {
      const match = findModeleBySlug(modeleMatch[1]);
      if (match) {
        if (match !== modeleMatch[1]) {
          logFix(url, `/modeles-de-courriers/${match}`);
        }
        return `/modeles-de-courriers/${match}`;
      }
    }
    return false;
  }

  const modeleMatch2 = url.match(/^\/modeles_de_courriers\/([^/#]+)/);
  if (modeleMatch2) {
    const found = modeles.find(fiche => fiche.slug === modeleMatch2[1]);
    if (found) {
      const fixedUrl = url.replace(
        "modeles_de_courriers",
        "modeles-de-courriers"
      );
      logFix(url, fixedUrl);
      return fixedUrl;
    }
    return false;
  }

  const ficheMinTMatch = url.match(/^\/?fiche-ministere-travail\/([^/#]+)/);
  if (ficheMinTMatch) {
    const slug = ficheMinTMatch[1];
    const fullSlug = url.match(/^\/?fiche-ministere-travail\/(.*)/)[1];
    const fixSlug = slug =>
      slug
        .replace(/# t[12345]-/, "#")
        .replace("#", "-")
        .replace(/-039-/, "")
        .toLowerCase();

    const foundFiche1 = fichesMT.find(fiche => fiche.slug === fullSlug);
    if (foundFiche1) {
      // perfect match
      return `/fiche-ministere-travail/${foundFiche1.slug}`;
    }

    const foundFiche2 = fichesMT.find(fiche => fixSlug(fiche.slug) === slug);

    if (foundFiche2) {
      logFix(url, `/fiche-ministere-travail/${foundFiche2.slug}`);
      return `/fiche-ministere-travail/${foundFiche2.slug}`;
    } else {
      // match full slug
      const match = findFicheMTBySlug(fullSlug);
      if (match) {
        if (match !== fullSlug) {
          logFix(url, `/fiche-ministere-travail/${match}`);
        }
        return `/fiche-ministere-travail/${match}`;
      } else {
        // match on anchor
        const match = findFicheMTByAnchor(fullSlug);
        if (match) {
          if (match !== fullSlug) {
            logFix(url, `/fiche-ministere-travail/${match}`);
          }
          return `/fiche-ministere-travail/${match}`;
        }
      }
    }

    return false;
  }

  const ficheSpMatch = url.match(/^\/fiche-service-public\/([^/#]+)/);
  if (ficheSpMatch) {
    const slug = ficheSpMatch[1];
    const foundFiche = fichesSP.find(fiche => fiche.slug === slug);
    if (foundFiche) {
      return url;
    }
    return false;
  }
  const themeMatch = url.match(/^\/themes\/([^/#]+)/);
  if (themeMatch) {
    const slug = themeMatch[1];
    const found = themes.find(fiche => fiche.slug === slug);
    if (found) {
      return url;
    }
    return false;
  }

  const contributionsMatch = url.match(/^\/contributions\/(.*)\/?/);
  if (contributionsMatch) {
    const slug = contributionsMatch[1];
    const found = contributions.find(fiche => fiche.slug === slug);
    if (found) {
      return url;
    }
    return false;
  }

  return false;
};

module.exports = { fixUrl };
