import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Table } from "reactstrap";
import { Edit } from "react-feather";

import Layout from "../../src/Layout";
import getClient from "../../src/kinto/client";
import dump from "../../src/dump.data.json";
import { getRouteBySource } from "../../src/sources";
import ThemePicker from "../../src/forms/components/ThemePicker";

const { DATA_FILLER_PATH } = process.env;

const addToTheme = async (content, theme) => {
  const client = getClient();
  const themeRecord = await client
    .bucket("datasets", { headers: {} })
    .collection("themes", { headers: {} })
    .getRecord(theme);

  const newRefs = [];

  // select all fiches MT with same slug
  if (content.source === "fiches_ministere_travail") {
    const siblings = dump
      .filter(r => r.source === "fiches_ministere_travail")
      .filter(r => r.slug.split("#")[0] === content.slug.split("#")[0])
      .map(r => ({
        title: r.title,
        url: `/${getRouteBySource(content.source)}/${r.slug}`
      }));
    newRefs.push(...siblings);
  } else {
    newRefs.push({
      title: content.title,
      url: `/${getRouteBySource(content.source)}/${content.slug}`
    });
  }

  await client
    .bucket("datasets", { headers: {} })
    .collection("themes", { headers: {} })
    .updateRecord(
      {
        id: theme,
        refs: [...(themeRecord.data.refs || []), ...newRefs]
      },
      {
        patch: true
      }
    );
};

const ThemeSelector = ({ record }) => {
  const [theme, setTheme] = useState("");
  return (
    <ThemePicker
      name="theme"
      style={{ cursor: "pointer" }}
      lazy={true}
      title={theme.title || <Edit />}
      value={theme && theme.id}
      onChange={theme => {
        addToTheme(record, theme.id);
        setTheme(theme);
      }}
    />
  );
};

const ThemeItems = ({ records }) => (
  <Table padding="dense" striped>
    <thead>
      <tr>
        <td width="400">Thème</td>
        <td>Titre</td>
      </tr>
    </thead>
    <tbody>
      {records.map(record => (
        <tr key={record.id}>
          <td width="400">
            <ThemeSelector record={record} />
          </td>
          <td>
            <a href={record.url} target="_blank" rel="noopener noreferrer">
              {record.title}
            </a>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default class ThemesSourcesPage extends React.Component {
  static async getInitialProps({ query }) {
    const { source } = query;
    const client = getClient();
    const themes = await client
      .bucket("datasets", { headers: {} })
      .collection("themes", { headers: {} })
      .listRecords({ limit: 1000 });
    const hasTheme = content => {
      const contentSlug = `/${getRouteBySource(source)}/${content.slug.split("#")[0]}`;
      return themes.data.find(
        theme =>
          theme.refs &&
          theme.refs.filter(ref => !!ref.url).find(ref => ref.url.split("#")[0] === contentSlug)
      );
    };
    const hasNoTheme = content => !hasTheme(content);
    const noThemeContents = dump
      .filter(content => content.source === source)
      .filter(hasNoTheme)
      .reduce((acc, content) => {
        // return only une fiche MT per slug (group documents)
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
      records: noThemeContents,
      source
    };
  }

  render() {
    const { records, source } = this.props;
    const label = getRouteBySource(source);

    return (
      <div>
        <Head>
          <title>Theming {label}</title>
        </Head>
        <Layout>
          <h4 style={{ margin: "40px 0" }}>
            <Link href={DATA_FILLER_PATH}>
              <a>Accueil</a>
            </Link>{" "}
            &gt; {records.length} {label} sans thème
          </h4>
          <ThemeItems records={records} />
        </Layout>
      </div>
    );
  }
}
