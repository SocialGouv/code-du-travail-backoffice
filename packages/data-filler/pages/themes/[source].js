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

const addToTheme = async (content, theme) => {
  const client = getClient();
  const themeRecord = await client
    .bucket("datasets", { headers: {} })
    .collection("themes", { headers: {} })
    .getRecord(theme);

  await client
    .bucket("datasets", { headers: {} })
    .collection("themes", { headers: {} })
    .updateRecord(
      {
        id: theme,
        refs: [
          ...(themeRecord.data.refs || []),
          {
            title: content.title,
            url: `/${getRouteBySource(content.source)}/${content.slug}`
          }
        ]
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
        <td>Titre</td>
        <td>Thème</td>
      </tr>
    </thead>
    <tbody>
      {records.map(record => (
        <tr key={record.title}>
          <td>
            <a href={record.url} target="_blank" rel="noopener noreferrer">
              {record.title}
            </a>
          </td>
          <td>
            <ThemeSelector record={record} />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const ContentPage = props => {
  const { records, source } = props;
  const label = getRouteBySource(source);
  return (
    <div>
      <Head>
        <title>Theming {label}</title>
      </Head>
      <Layout>
        <h4 style={{ margin: "40px 0" }}>
          <Link href="/">
            <a>Accueil</a>
          </Link>{" "}
          &gt; {records.length} {label} sans thème
        </h4>
        <ThemeItems records={records} />
      </Layout>
    </div>
  );
};

ContentPage.getInitialProps = async ({ query }) => {
  const { source } = query;
  const client = getClient();
  const themes = await client
    .bucket("datasets", { headers: {} })
    .collection("themes", { headers: {} })
    .listRecords({ limit: 1000 });
  const hasTheme = content => {
    const contentSlug = `/${getRouteBySource(source)}/${content.slug}`;
    return themes.data.find(
      theme =>
        theme.refs &&
        theme.refs.filter(ref => !!ref.url).find(ref => ref.url === contentSlug)
    );
  };
  const hasNoTheme = content => !hasTheme(content);
  const noThemeContents = dump
    .filter(content => content.source === source)
    .filter(hasNoTheme);

  return {
    records: noThemeContents,
    source
  };
};

export default ContentPage;
