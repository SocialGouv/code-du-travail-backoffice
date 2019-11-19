import React, { useState } from "react";
import Link from "next/link";
import { ListGroup, ListGroupItem, Input } from "reactstrap";
import { PlusSquare, Home } from "react-feather";
import KintoContext from "./kinto/KintoContext";
import ThemeLink from "./ThemeLink";
import ProgressIndicator from "./forms/components/ProgressIndicator";
import getScore from "./getScore";

const normalize = str => str.toLowerCase().trim();

const matchQuery = query => record =>
  !query || normalize(record.title).includes(normalize(query));

const ListRecordsView = ({
  records,
  bucket,
  collection,
  record,
  onAddClick
}) => {
  const [query, setQuery] = useState("");
  return (
    <React.Fragment>
      <ListGroup
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "absolute"
        }}
      >
        <ListGroupItem action style={{ flex: "0 0 auto" }}>
          <Link href="/" passHref>
            <a>
              <Home style={{ marginRight: 5, verticalAlign: "middle" }} />{" "}
              Accueil
            </a>
          </Link>
        </ListGroupItem>

        <ListGroupItem style={{ flex: "0 0 auto" }}>
          <KintoContext.Consumer>
            {({ client }) => (
              <a href="#" onClick={() => onAddClick({ client })}>
                <PlusSquare
                  style={{ marginRight: 5, verticalAlign: "middle" }}
                />
                Ajouter une entrée
              </a>
            )}
          </KintoContext.Consumer>
        </ListGroupItem>

        <ListGroupItem style={{ flex: "0 0 auto" }}>
          <Input
            onChange={e => setQuery(e.target.value)}
            value={query}
            placeholder="Filtrer"
          />
        </ListGroupItem>

        <div style={{ overflow: "scroll" }}>
          {records.filter(matchQuery(query)).map(item => (
            <ListGroupItem
              action
              active={item.id === record}
              title={item.title}
              key={item.id}
              style={{
                padding: ".5rem 1.25rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                width: 270
              }}
            >
              <ProgressIndicator score={getScore(collection, item)} />
              <ThemeLink
                bucket={bucket}
                collection={collection}
                item={item}
                record={record}
                focus={item.id === record}
              />
            </ListGroupItem>
          ))}
        </div>
      </ListGroup>
    </React.Fragment>
  );
};

export default ListRecordsView;
