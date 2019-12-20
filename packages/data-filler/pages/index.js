import Router from "next/router";
import React from "react";

import ProgressIndicator from "../src/forms/components/ProgressIndicator";
import dump from "../src/dump.data.json";
import getClient from "../src/kinto/client";
import getScore from "../src/getScore";
import sortByKey from "../src/sortByKey";
import { sources, getRouteBySource } from "../src/sources";

import { Eye, Database, Plus } from "react-feather";

import {
  Badge,
  ListGroup,
  ListGroupItem,
  Card,
  CardText,
  CardBody,
  Jumbotron,
  Container,
  Button,
  Row,
  Col,
  Table,
  Progress
} from "reactstrap";

const { DATA_FILLER_PATH } = process.env;

class Link extends React.PureComponent {
  goTo(path) {
    Router.push(path);
  }

  render() {
    const { children, href } = this.props;

    return (
      <span
        onClick={() => this.goTo(href)}
        onKeyPress={() => this.goTo(href)}
        role="link"
        tabIndex="-1"
      >
        {children}
      </span>
    );
  }
}

const BucketIntro = () => (
  <Jumbotron style={{ padding: 10, marginTop: 5, marginBottom: 0 }}>
    <h2 className="display-6">
      <Database style={{ marginRight: 5, verticalAlign: "bottom" }} size="1.35em" /> Datafiller
    </h2>
    <p className="lead" style={{ marginBottom: 0 }}>
      Données de référence pour alimenter le moteur de recherche.
    </p>
  </Jumbotron>
);

const ButtonRecord = ({ bucket, collection, record, text, Icon }) => (
  <Link href={`${DATA_FILLER_PATH}/bucket/${bucket}/collection/${collection}/record/${record}`}>
    <Button color="primary" size="sm">
      {Icon && <Icon style={{ marginRight: 10 }} />}
      {text}
    </Button>
  </Link>
);

const BucketView = ({ bucket, collections = [], themes }) => {
  return (
    <Container>
      <Row>
        {collections.map(collection => {
          const lastRecords = collection.records
            .filter(r => !!r.title)
            .sort(sortByKey(r => -r.last_modified))
            .slice(0, 10);
          const lastRecord = lastRecords.length && lastRecords[0];
          return (
            <Col xs={12} sm={6} key={collection.id}>
              <Card style={{ marginTop: 15 }}>
                <CardBody>
                  <Row>
                    <Col xs={8} style={{ fontSize: "1.5em" }}>
                      {collection.id}
                      <Badge
                        style={{
                          marginLeft: 15,
                          display: "inline",
                          fontSize: "0.6em",
                          verticalAlign: "middle"
                        }}
                        color="success"
                      >
                        {collection.records.length}
                      </Badge>
                    </Col>
                    <Col style={{ textAlign: "right" }}>
                      {(lastRecord && (
                        <ButtonRecord
                          bucket={bucket}
                          collection={collection.id}
                          record={lastRecord.id}
                          Icon={Eye}
                          text="Ouvrir"
                        />
                      )) || (
                        <ButtonRecord
                          bucket={bucket}
                          collection={collection.id}
                          Icon={Plus}
                          record="new"
                          text="Ajouter"
                        />
                      )}
                    </Col>
                  </Row>
                  {collection.schema && collection.schema.title && (
                    <Row>
                      <Col>
                        <CardText variant="subtitle1">
                          {collection.schema && collection.schema.title}
                        </CardText>
                      </Col>
                    </Row>
                  )}
                  <ListGroup flush style={{ marginTop: 20 }}>
                    {lastRecords.map(rec => (
                      <Link
                        href={`/bucket/${bucket}/collection/${collection.id}/record/${rec.id}`}
                        key={rec.id}
                      >
                        <ListGroupItem
                          tag="a"
                          href="#"
                          title={rec.title}
                          style={{ padding: ".2rem 0" }}
                          className="text-truncate"
                        >
                          <ProgressIndicator score={getScore(collection.id, rec)} />
                          {rec.title}
                        </ListGroupItem>
                      </Link>
                    ))}
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
          );
        })}
        <Col xs={12} sm={6} key="themes">
          <Card style={{ marginTop: 15 }}>
            <CardBody>
              <div style={{ fontSize: "1.5em", marginBottom: 35 }}>Contenus à thémer</div>
              <Table>
                <tbody>
                  {themes
                    .filter(item => item.items.length)
                    .map(item => (
                      <tr key={item.source}>
                        <td>
                          <Link href={`${DATA_FILLER_PATH}/themes/${item.source}`}>
                            <a href="#">{getRouteBySource(item.source)}</a>
                          </Link>
                        </td>
                        <td width="200" style={{ verticalAlign: "middle" }}>
                          <Progress
                            color="success"
                            value={((item.total - item.items.length) / item.total) * 100}
                          >
                            {parseInt(((item.total - item.items.length) / item.total) * 100)}%
                          </Progress>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const fetchAllCollections = async () => {
  const client = getClient();
  const collectionList = await client
    .bucket("datasets", { headers: {} })
    .listCollections({ headers: {} });
  return await Promise.all(
    collectionList.data.map(collection =>
      client
        .bucket("datasets", { headers: {} })
        .collection(collection.id, { headers: {} })
        .listRecords({ limit: 1000 })
        .then(records => ({
          id: collection.id,
          records: records.data
        }))
    )
  );
};

const fetchRecapThemes = async () => {
  const client = getClient();
  const themes = await client
    .bucket("datasets", { headers: {} })
    .collection("themes", { headers: {} })
    .listRecords({ limit: 1000 });

  const bySource = source => {
    const hasTheme = content => {
      const contentSlug = `/${getRouteBySource(source)}/${content.slug.split("#")[0]}`;
      return themes.data.find(
        theme =>
          theme.refs &&
          theme.refs.filter(ref => !!ref.url).find(ref => ref.url.split("#")[0] === contentSlug)
      );
    };
    const hasNoTheme = content => !hasTheme(content);
    const allContent = dump.filter(content => content.source === source);
    const noThemeContents = allContent.filter(hasNoTheme).reduce((acc, content) => {
      if (
        source === "fiches_ministere_travail" &&
        acc.find(c => c.slug.split("#")[0] === content.slug.split("#")[0])
      ) {
        return acc;
      }
      acc.push(content);
      return acc;
    }, []);

    return {
      total: allContent.length,
      items: noThemeContents
    };
  };

  return sources
    .filter(source => source !== "themes")
    .map(source => ({
      source,
      ...bySource(source)
    }));
};

// by default we list the process.env.KINTO_BUCKET
export default class Home extends React.Component {
  static async getInitialProps({ query }) {
    const collections = await fetchAllCollections();
    const themes = await fetchRecapThemes();
    return { query: query.query, collections, themes };
  }

  render() {
    const bucket = process.env.KINTO_BUCKET;
    const { collections, themes } = this.props;

    return (
      <Container>
        <BucketIntro />
        <BucketView bucket={bucket} collections={collections} themes={themes} />
      </Container>
    );
  }
}
