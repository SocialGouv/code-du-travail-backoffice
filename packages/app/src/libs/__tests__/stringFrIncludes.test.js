import stringFrIncludes from "../stringFrIncludes";

describe("libs/stringFrIncludes()", () => {
  const text = `
    Ah ! non ! c’est un peu court, jeune homme !
    On pouvait dire… Oh ! Dieu ! … bien des choses en somme…
    En variant le ton, – par exemple, tenez :
    Agressif : « Moi, monsieur, si j’avais un tel nez,
    Il faudrait sur-le-champ que je me l’amputasse ! »
    Amical : « Mais il doit tremper dans votre tasse
    Pour boire, faites-vous fabriquer un hanap ! »
    Descriptif : « C’est un roc ! … c’est un pic ! … c’est un cap !
    Que dis-je, c’est un cap ? … C’est une péninsule ! »
    Curieux : « De quoi sert cette oblongue capsule ?
    D’écritoire, monsieur, ou de boîte à ciseaux ? »
    Gracieux : « Aimez-vous à ce point les oiseaux
    Que paternellement vous vous préoccupâtes
    De tendre ce perchoir à leurs petites pattes ? »
    Truculent : « Ça, monsieur, lorsque vous pétunez,
    La vapeur du tabac vous sort-elle du nez
    Sans qu’un voisin ne crie au feu de cheminée ? »
    Prévenant : « Gardez-vous, votre tête entraînée
    Par ce poids, de tomber en avant sur le sol ! »
    Tendre : « Faites-lui faire un petit parasol
    De peur que sa couleur au soleil ne se fane ! »
    Pédant : « L’animal seul, monsieur, qu’Aristophane
    Appelle Hippocampéléphantocamélos
    Dut avoir sous le front tant de chair sur tant d’os ! »
    Cavalier : « Quoi, l’ami, ce croc est à la mode ?
    Pour pendre son chapeau, c’est vraiment très commode ! »
    Emphatique : « Aucun vent ne peut, nez magistral,
    T’enrhumer tout entier, excepté le mistral ! »
    Dramatique : « C’est la Mer Rouge quand il saigne ! »
    Admiratif : « Pour un parfumeur, quelle enseigne ! »
    Lyrique : « Est-ce une conque, êtes-vous un triton ? »
    Naïf : « Ce monument, quand le visite-t-on ? »
    Respectueux : « Souffrez, monsieur, qu’on vous salue,
    C’est là ce qui s’appelle avoir pignon sur rue ! »
    Campagnard : « Hé, ardé ! C’est-y un nez ? Nanain !
    C’est queuqu’navet géant ou ben queuqu’melon nain ! »
    Militaire : « Pointez contre cavalerie ! »
    Pratique : « Voulez-vous le mettre en loterie ?
    Assurément, monsieur, ce sera le gros lot ! »
    Enfin parodiant Pyrame en un sanglot :
    « Le voilà donc ce nez qui des traits de son maître
    A détruit l’harmonie ! Il en rougit, le traître ! »
    – Voilà ce qu’à peu près, mon cher, vous m’auriez dit
    Si vous aviez un peu de lettres et d’esprit
    Mais d’esprit, ô le plus lamentable des êtres,
    Vous n’en eûtes jamais un atome, et de lettres
    Vous n’avez que les trois qui forment le mot : sot !
    Eussiez-vous eu, d’ailleurs, l’invention qu’il faut
    Pour pouvoir là, devant ces nobles galeries,
    me servir toutes ces folles plaisanteries,
    Que vous n’en eussiez pas articulé le quart
    De la moitié du commencement d’une, car
    Je me les sers moi-même, avec assez de verve,
    Mais je ne permets pas qu’un autre me les serve.
  `;

  it("should find these strings", () => {
    expect(stringFrIncludes("C'est-y un nez ?", text)).toBe(true);
    expect(stringFrIncludes("FAITES-LUI", text)).toBe(true);
    expect(stringFrIncludes("he, arde !", text)).toBe(true);
    expect(stringFrIncludes("moitie", text)).toBe(true);
    expect(stringFrIncludes("naif", text)).toBe(true);
    expect(stringFrIncludes("o le plus lamentable", text)).toBe(true);
    expect(stringFrIncludes("PRÈS", text)).toBe(true);
    expect(stringFrIncludes("voila", text)).toBe(true);
  });

  it("should not find these strings", () => {
    expect(stringFrIncludes("voilâ", text)).toBe(false);
  });
});
