import React, { useState, useContext, useEffect } from "react";
import useFetch from "react-fetch-hook";
import Tooltip from "rc-tooltip";

import {
  Badge,
  Card,
  CardBody,
  Container,
  FormGroup,
  Jumbotron,
  Label,
  Input
} from "reactstrap";

import "rc-tooltip/assets/bootstrap_white.css";

// d'après la note DGT "DGT - Fiche 2018-29 - Ordonnances 2017 -Fiche Hiérarchie des normes"
const groups = [
  { id: "1", label: `Bloc 1 : Salaires minima hiérarchiques` },
  { id: "2", label: `Bloc 2 : Classifications` },
  {
    id: "3",
    label: `Bloc 3 : Mutualisation des fonds de financement du paritarisme`
  },
  {
    id: "4",
    label: `Bloc 4 : Mutualisation des fonds de la formation professionnelle`
  },
  { id: "5", label: `Bloc 5 : Prévoyance` },
  {
    id: "6",
    label: `Bloc 6 : Durée du travail, répartition et aménagement des horaires`
  },
  {
    id: "7",
    label: `Bloc 7 : CDD/CTT : durée minimale, majoration heures complémentaires et compléments d'heures`
  },
  { id: "8", label: `Bloc 8 : CDI de chantier ou d'opération` },
  {
    id: "9",
    label: `Bloc 9 : Egalité professionnelle entre les femmes et les hommes`
  },
  {
    id: "10",
    label: `Bloc 10 : Conditions et les durées de renouvellement de la période d’essai`
  },
  {
    id: "11",
    label: `Bloc 11 : Modalités de poursuite des contrats de travail`
  },
  { id: "12", label: `Bloc 12 : Mise à disposition d’un salarié temporaire` },
  { id: "13", label: `Bloc 13 : Rémunération minimale du salarié porté` },
  {
    id: "14",
    label: `Bloc 14 : Prévention des effets de l’exposition aux facteurs de risques professionnels`
  },
  {
    id: "15",
    label: `Bloc 15 : Insertion professionnelle et maintien dans l’emploi des travailleurs handicapés`
  },
  {
    id: "16",
    label: `Bloc 16 : Effectif à partir duquel les délégués syndicaux peuvent être désignés, nombre et valorisation de leurs parcours syndical`
  },
  { id: "17", label: `Bloc 17 : Primes pour travaux dangereux ou insalubres` }
];

const Article = ({ article, idTexte, onSelectGroup }) => {
  const selection = useContext(SelectionContext);
  const currentGroupsIds =
    selection.groups &&
    selection.groups
      .filter(group => group.selection && group.selection.includes(article.id))
      .map(gr => gr.id);

  return (
    <div style={{ margin: "5px 0" }}>
      <div
        style={{
          border: "1px solid silver",
          borderRight: "none",
          cursor: "pointer",
          display: "inline-block"
        }}
      >
        {groups.map(group => (
          <div
            style={{
              display: "inline-block",
              textAlign: "center",
              borderRight: "1px solid silver",
              padding: "5px 5px",
              minWidth: 30,
              backgroundColor: currentGroupsIds.includes(group.id)
                ? "#ddf1ff"
                : "white"
            }}
            title={group.label}
            key={group.id}
            onClick={() => onSelectGroup(group)}
          >
            {group.id}
          </div>
        ))}
      </div>
      <Badge
        color="primary"
        {...formatEtat(article.etat)}
        style={{ fontSize: 10, margin: "0 5px", minWidth: 30 }}
        size="small"
      />
      <Tooltip
        overlayStyle={{ maxWidth: "50%" }}
        placement="bottom"
        trigger={["click"]}
        overlay={<span dangerouslySetInnerHTML={{ __html: article.content }} />}
      >
        <span style={{ cursor: "pointer", marginLeft: 10 }}>
          Article {article.num || "-"} {article.surtitre || null}
        </span>
      </Tooltip>

      <a
        style={{ marginLeft: 5, fontSize: 12 }}
        href={`https://www.legifrance.gouv.fr/affichIDCCArticle.do?idArticle=${article.id}&cidTexte=${idTexte}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Legifrance
      </a>
    </div>
  );
};

const formatEtat = etat =>
  ({
    VIGUEUR_ETEN: { label: "E", title: "Étendu", color: "primary" },
    VIGUEUR_NON_ETEN: { label: "NE", title: "Non-étendu", color: "secondary" }
  }[etat]);

const SelectionContext = React.createContext([]);

/*
          <div>
            <h5>{section.title}</h5>
            <FormGroup row>
              <Label>Notes (privées)</Label>
              <Input name="notes" type="textarea" rows={10} />
            </FormGroup>
          </div>*/

const CCNSection = ({
  idConvention,
  section,
  onSelect,
  depth = 0,
  idTexte
}) => {
  idTexte = (depth === 0 && section.id) || idTexte;
  return (
    <Card
      style={{
        marginTop: 15,
        overflow: "visible"
      }}
      className="card--section"
    >
      <CardBody>
        {depth >= 0 && <h6>{section.title}</h6>}

        {(depth === 0 && (
          <a
            style={{ marginLeft: 5, fontSize: 12 }}
            href={`https://www.legifrance.gouv.fr/affichIDCC.do?cidTexte=${section.id}&idConvention=${idConvention}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Legifrance
          </a>
        )) ||
          null}
        {section.sections.map(section => (
          <CCNSection
            key={section.id}
            idConvention={idConvention}
            idTexte={idTexte}
            section={section}
            depth={depth + 1}
            onSelect={onSelect}
          />
        ))}
        {section.articles.map(article => (
          <Article
            idTexte={idTexte}
            key={article.id}
            article={article}
            onSelectGroup={group => onSelect(article, group)}
          />
        ))}
      </CardBody>
    </Card>
  );
};

const CCNPreview = ({ id, initialData, onDataUpdate }) => {
  // import(`@socialgouv/kali-data/data/${id}.json`);
  const { isLoading, data } = useFetch(`/api/ccn/${id}.json`, {
    formatter: response => response.json()
  });

  const [groups, setGroups] = useState(initialData.groups);

  if (isLoading || !data) {
    return <div>...</div>;
  }

  const setSelection = (node, group) => {
    // check if already present : remove it
    const curGroup = groups && groups.find(gr => gr.id === group.id);
    let newGroups = curGroup
      ? // when group exist, modify or create the selection
        groups.map(gr =>
          gr.id === group.id
            ? {
                id: gr.id,
                selection: gr.selection
                  ? gr.selection.includes(node.id)
                    ? // if already selected, drop it
                      gr.selection.filter(sel => sel !== node.id)
                    : gr.selection.concat([node.id])
                  : [node.id]
              }
            : gr
        )
      : // when group does not exist, create it
        [
          ...(groups || []),
          {
            id: group.id,
            selection: [node.id]
          }
        ];
    setGroups(newGroups);
    onDataUpdate({
      groups: newGroups
    });
  };

  return (
    <Container>
      <SelectionContext.Provider value={{ groups: initialData.groups || [] }}>
        <Jumbotron>
          <h5>{data.titre}</h5>
        </Jumbotron>
        <Container>
          <FormGroup row>
            <Label>Notes privées</Label>
            <Input
              name="intro"
              type="textarea"
              rows={5}
              onBlur={e => {
                onDataUpdate({
                  intro: e.target.value
                });
              }}
              defaultValue={initialData.intro || ""}
            />
          </FormGroup>
        </Container>
        <CCNSection
          idConvention={id}
          onSelect={setSelection}
          section={data.sections[0]}
        />
        ;
      </SelectionContext.Provider>
    </Container>
  );
};

const FormCCN = ({ data, onSubmit }) => {
  const [formData, setFormData] = React.useState(data);
  useEffect(() => {
    setFormData(data);
  }, [data]);
  const onDataUpdate = patch => {
    // side-effects : general record update
    const newData = {
      ...formData,
      ...patch
    };
    onSubmit(newData)
      .then(() => setFormData(newData))
      .catch(e => {
        console.log(e);
        alert("Impossible de mettre à jour");
      });
    // todo: handle errors
  };

  return (
    <CCNPreview
      id={data.cid}
      initialData={formData || { groups: [], intro: "" }}
      onDataUpdate={onDataUpdate}
    />
  );
};

export default FormCCN;
