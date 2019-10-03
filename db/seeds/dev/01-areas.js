exports.seed = async knex => {
  global.spinner.start(`Generating areas...`);

  const suiGenerisCollectivities = [
    {
      category: "sui_generis_collectivity",
      code: "SGCNC",
      name: `Nouvelle-Calédonie`
    }
  ];

  await knex("api.areas").insert(suiGenerisCollectivities);

  const overseasCollectivities = [
    {
      category: "overseas_collectivity",
      code: "OC975",
      name: `Saint-Pierre-et-Miquelon`
    },
    {
      category: "overseas_collectivity",
      code: "OC977",
      name: `Saint-Barthélemy`
    },
    { category: "overseas_collectivity", code: "OC978", name: `Saint-Martin` },
    {
      category: "overseas_collectivity",
      code: "OC986",
      name: `Wallis-et-Futuna`
    },
    {
      category: "overseas_collectivity",
      code: "OC987",
      name: `Polynésie française`
    }
  ];

  await knex("api.areas").insert(overseasCollectivities);

  const regions = [
    { category: "region", code: "01", name: `Guadeloupe` },
    { category: "region", code: "02", name: `Martinique` },
    { category: "region", code: "03", name: `Guyane` },
    { category: "region", code: "04", name: `La Réunion` },
    { category: "region", code: "06", name: `Mayotte` },
    { category: "region", code: "11", name: `Île-de-France` },
    { category: "region", code: "24", name: `Centre-Val de Loire` },
    { category: "region", code: "27", name: `Bourgogne-Franche-Comté` },
    { category: "region", code: "28", name: `Normandie` },
    { category: "region", code: "32", name: `Hauts-de-France` },
    { category: "region", code: "44", name: `Grand Est` },
    { category: "region", code: "52", name: `Pays de la Loire` },
    { category: "region", code: "53", name: `Bretagne` },
    { category: "region", code: "75", name: `Nouvelle-Aquitaine` },
    { category: "region", code: "76", name: `Occitanie` },
    { category: "region", code: "84", name: `Auvergne-Rhône-Alpes` },
    { category: "region", code: "93", name: `Provence-Alpes-Côte d'Azur` },
    { category: "region", code: "94", name: `Corse` }
  ];

  await knex("api.areas").insert(regions);

  const departments = [
    { region: "84", code: "001", name: `Ain` },
    { region: "32", code: "002", name: `Aisne` },
    { region: "84", code: "003", name: `Allier` },
    { region: "93", code: "004", name: `Alpes-de-Haute-Provence` },
    { region: "93", code: "005", name: `Hautes-Alpes` },
    { region: "93", code: "006", name: `Alpes-Maritimes` },
    { region: "84", code: "007", name: `Ardèche` },
    { region: "44", code: "008", name: `Ardennes` },
    { region: "76", code: "009", name: `Ariège` },
    { region: "44", code: "010", name: `Aube` },
    { region: "76", code: "011", name: `Aude` },
    { region: "76", code: "012", name: `Aveyron` },
    { region: "93", code: "013", name: `Bouches-du-Rhône` },
    { region: "28", code: "014", name: `Calvados` },
    { region: "84", code: "015", name: `Cantal` },
    { region: "75", code: "016", name: `Charente` },
    { region: "75", code: "017", name: `Charente-Maritime` },
    { region: "24", code: "018", name: `Cher` },
    { region: "75", code: "019", name: `Corrèze` },
    { region: "27", code: "021", name: `Côte-d'Or` },
    { region: "53", code: "022", name: `Côtes-d'Armor` },
    { region: "75", code: "023", name: `Creuse` },
    { region: "75", code: "024", name: `Dordogne` },
    { region: "27", code: "025", name: `Doubs` },
    { region: "84", code: "026", name: `Drôme` },
    { region: "28", code: "027", name: `Eure` },
    { region: "24", code: "028", name: `Eure-et-Loir` },
    { region: "53", code: "029", name: `Finistère` },
    { region: "94", code: "02A", name: `Corse-du-Sud` },
    { region: "94", code: "02B", name: `Haute-Corse` },
    { region: "76", code: "030", name: `Gard` },
    { region: "76", code: "031", name: `Haute-Garonne` },
    { region: "76", code: "032", name: `Gers` },
    { region: "75", code: "033", name: `Gironde` },
    { region: "76", code: "034", name: `Hérault` },
    { region: "53", code: "035", name: `Ille-et-Vilaine` },
    { region: "24", code: "036", name: `Indre` },
    { region: "24", code: "037", name: `Indre-et-Loire` },
    { region: "84", code: "038", name: `Isère` },
    { region: "27", code: "039", name: `Jura` },
    { region: "75", code: "040", name: `Landes` },
    { region: "24", code: "041", name: `Loir-et-Cher` },
    { region: "84", code: "042", name: `Loire` },
    { region: "84", code: "043", name: `Haute-Loire` },
    { region: "52", code: "044", name: `Loire-Atlantique` },
    { region: "24", code: "045", name: `Loiret` },
    { region: "76", code: "046", name: `Lot` },
    { region: "75", code: "047", name: `Lot-et-Garonne` },
    { region: "76", code: "048", name: `Lozère` },
    { region: "52", code: "049", name: `Maine-et-Loire` },
    { region: "28", code: "050", name: `Manche` },
    { region: "44", code: "051", name: `Marne` },
    { region: "44", code: "052", name: `Haute-Marne` },
    { region: "52", code: "053", name: `Mayenne` },
    { region: "44", code: "054", name: `Meurthe-et-Moselle` },
    { region: "44", code: "055", name: `Meuse` },
    { region: "53", code: "056", name: `Morbihan` },
    { region: "44", code: "057", name: `Moselle` },
    { region: "27", code: "058", name: `Nièvre` },
    { region: "32", code: "059", name: `Nord` },
    { region: "32", code: "060", name: `Oise` },
    { region: "28", code: "061", name: `Orne` },
    { region: "32", code: "062", name: `Pas-de-Calais` },
    { region: "84", code: "063", name: `Puy-de-Dôme` },
    { region: "75", code: "064", name: `Pyrénées-Atlantiques` },
    { region: "76", code: "065", name: `Hautes-Pyrénées` },
    { region: "76", code: "066", name: `Pyrénées-Orientales` },
    { region: "44", code: "067", name: `Bas-Rhin` },
    { region: "44", code: "068", name: `Haut-Rhin` },
    { region: "84", code: "069", name: `Rhône` },
    { region: "27", code: "070", name: `Haute-Saône` },
    { region: "27", code: "071", name: `Saône-et-Loire` },
    { region: "52", code: "072", name: `Sarthe` },
    { region: "84", code: "073", name: `Savoie` },
    { region: "84", code: "074", name: `Haute-Savoie` },
    { region: "11", code: "075", name: `Paris` },
    { region: "28", code: "076", name: `Seine-Maritime` },
    { region: "11", code: "077", name: `Seine-et-Marne` },
    { region: "11", code: "078", name: `Yvelines` },
    { region: "75", code: "079", name: `Deux-Sèvres` },
    { region: "32", code: "080", name: `Somme` },
    { region: "76", code: "081", name: `Tarn` },
    { region: "76", code: "082", name: `Tarn-et-Garonne` },
    { region: "93", code: "083", name: `Var` },
    { region: "93", code: "084", name: `Vaucluse` },
    { region: "52", code: "085", name: `Vendée` },
    { region: "75", code: "086", name: `Vienne` },
    { region: "75", code: "087", name: `Haute-Vienne` },
    { region: "44", code: "088", name: `Vosges` },
    { region: "27", code: "089", name: `Yonne` },
    { region: "27", code: "090", name: `Territoire de Belfort` },
    { region: "11", code: "091", name: `Essonne` },
    { region: "11", code: "092", name: `Hauts-de-Seine` },
    { region: "11", code: "093", name: `Seine-Saint-Denis` },
    { region: "11", code: "094", name: `Val-de-Marne` },
    { region: "11", code: "095", name: `Val-d'Oise` },
    { region: "01", code: "971", name: `Guadeloupe` },
    { region: "02", code: "972", name: `Martinique` },
    { region: "03", code: "973", name: `Guyane` },
    { region: "04", code: "974", name: `La Réunion` },
    { region: "06", code: "976", name: `Mayotte` }
  ];

  for (let department of departments) {
    const areaRes = await knex("api.areas").where({ code: department.region });

    await knex("api.areas").insert({
      code: department.code,
      name: department.name,
      category: "department",
      parent_id: areaRes[0].id
    });
  }

  global.spinner.succeed(`Areas generated.`);
};
