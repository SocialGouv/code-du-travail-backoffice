import React from "react";
import getConfig from "next/config";
import Link from "next/link";

import ProgressIndicator from "../src/forms/components/ProgressIndicator";
import sortByKey from "../src/sortByKey";
import getScore from "../src/getScore";
import getClient from "../src/kinto/client";
import { sources, getRouteBySource } from "../src/sources";
import dump from "../src/dump.data.json";

import { Eye, Database, Plus, Star } from "react-feather";

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

const { publicRuntimeConfig } = getConfig();

const BucketIntro = ({ count }) => (
  <Jumbotron>
    <h2 className="display-3">
      <Database
        style={{ marginRight: 5, verticalAlign: "bottom" }}
        size="1.35em"
      />{" "}
      Datafiller
      <div
        style={{ fontSize: "1.5rem", display: "inline-block", marginLeft: 10 }}
      >
        {count}
        <Star fill="yellow" size={24} style={{ marginLeft: 5 }} />
      </div>
    </h2>
    <p className="lead">
      Données de référence pour alimenter le moteur de recherche.
    </p>
  </Jumbotron>
);

const sum = arr => arr.reduce((a, c) => a + c, 0);

const ButtonRecord = ({ bucket, collection, record, text, Icon }) => (
  <Link href={`/bucket/${bucket}/collection/${collection}/record/${record}`}>
    <Button variant="contained" color="primary">
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
            .slice(0, 5);
          const lastRecord = lastRecords.length && lastRecords[0];
          return (
            <Col xs={12} sm={6} key={collection.id}>
              <Card style={{ marginTop: 15 }}>
                <CardBody>
                  <Row>
                    <Col xs={8} style={{ fontSize: "1.5em" }}>
                      {collection.id}
                      <Badge
                        style={{ marginLeft: 15, display: "inline" }}
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
                  <Row>
                    <Col>
                      <CardText variant="subtitle1">
                        {collection.schema && collection.schema.title}
                      </CardText>
                    </Col>
                  </Row>
                  <ListGroup flush style={{ marginTop: 30 }}>
                    {lastRecords.map(rec => (
                      <Link
                        href={`/bucket/${bucket}/collection/${collection.id}/record/${rec.id}`}
                        key={rec.id}
                      >
                        <ListGroupItem
                          tag="a"
                          href="#"
                          title={rec.title}
                          style={{ padding: ".5rem 1.25rem" }}
                          className="text-truncate"
                        >
                          <ProgressIndicator
                            score={getScore(collection.id, rec)}
                          />
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
              <div style={{ fontSize: "1.5em", marginBottom: 35 }}>
                Contenus à thémer
              </div>
              <Table>
                <tbody>
                  {themes
                    .filter(item => item.items.length)
                    .map(item => (
                      <tr key={item.source}>
                        <td>
                          <Link
                            href={`/themes/[source]`}
                            as={`/themes/${item.source}`}
                            passHref
                          >
                            <a>{getRouteBySource(item.source)}</a>
                          </Link>
                        </td>
                        <td>
                          <div>
                            <Progress
                              value={
                                ((item.total - item.items.length) /
                                  item.total) *
                                100
                              }
                            >
                              {parseInt(
                                ((item.total - item.items.length) /
                                  item.total) *
                                  100
                              )}
                              %
                            </Progress>
                          </div>
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
      const contentSlug = `/${getRouteBySource(source)}/${content.slug}`;
      return themes.data.find(
        theme =>
          theme.refs &&
          theme.refs
            .filter(ref => !!ref.url)
            .find(ref => ref.url === contentSlug)
      );
    };
    const hasNoTheme = content => !hasTheme(content);
    const allContent = dump.filter(content => content.source === source);
    const noThemeContents = allContent.filter(hasNoTheme);

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
class Home extends React.Component {
  static async getInitialProps({ query }) {
    const collections = await fetchAllCollections();
    const themes = await fetchRecapThemes();
    return { query: query.query, collections, themes };
  }
  render() {
    const bucket = publicRuntimeConfig.KINTO_BUCKET;
    const { collections, themes } = this.props;
    const total = sum(collections.map(c => c.records.length));
    return (
      <Container>
        <BucketIntro count={total} />
        <BucketView bucket={bucket} collections={collections} themes={themes} />
      </Container>
    );
  }
}

export default Home;
