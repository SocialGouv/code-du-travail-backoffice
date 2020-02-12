import Router from "next/router";
import React from "react";

import cache from "../../cache";
import { USER_ROLE } from "../../constants";
import styles, { Link, Subtitle } from "./styles";

export default class AdminMenu extends React.PureComponent {
  goTo(resource) {
    Router.push(`/admin${resource}`);
  }

  render() {
    const me = cache.get("me");

    if (me === null) {
      return (
        <div className="Container">
          <style jsx>{styles}</style>
        </div>
      );
    }

    const isRegionalAdmin = me.role === USER_ROLE.REGIONAL_ADMINISTRATOR;

    if (isRegionalAdmin) {
      return (
        <div className="Container">
          <style jsx>{styles}</style>
          <Link
            onClick={() => this.goTo("")}
            onKeyPress={() => this.goTo("")}
            role="link"
            tabIndex="0"
          >
            Tableau de bord
          </Link>
        </div>
      );
    }

    return (
      <div className="Container">
        <style jsx>{styles}</style>
        <Link
          onClick={() => this.goTo("")}
          onKeyPress={() => this.goTo("")}
          role="link"
          tabIndex="0"
        >
          Tableau de bord
        </Link>
        <Link
          onClick={() => this.goTo("/agreements")}
          onKeyPress={() => this.goTo("/agreements")}
          role="link"
          tabIndex="0"
        >
          Conventions
        </Link>
        <Link
          onClick={() => this.goTo("/tags")}
          onKeyPress={() => this.goTo("/tags")}
          role="link"
          tabIndex="0"
        >
          Étiquettes
        </Link>
        <Link
          onClick={() => this.goTo("/tags-categories")}
          onKeyPress={() => this.goTo("/tags-categories")}
          role="link"
          tabIndex="0"
        >
          └ Catégories
        </Link>
        <Link
          onClick={() => this.goTo("/questions")}
          onKeyPress={() => this.goTo("/questions")}
          role="link"
          tabIndex="0"
        >
          Questions
        </Link>
        <Link
          onClick={() => this.goTo("/answers")}
          onKeyPress={() => this.goTo("/answers")}
          role="link"
          tabIndex="0"
        >
          Réponses
        </Link>
        <Link
          onClick={() => this.goTo("/generic-answers")}
          onKeyPress={() => this.goTo("/generic-answers")}
          role="link"
          tabIndex="0"
        >
          Réponses génériques
        </Link>
        <Link
          onClick={() => this.goTo("/locations")}
          onKeyPress={() => this.goTo("/locations")}
          role="link"
          tabIndex="0"
        >
          Unités
        </Link>
        <Link
          onClick={() => this.goTo("/users")}
          onKeyPress={() => this.goTo("/users")}
          role="link"
          tabIndex="0"
        >
          Utilisateurs
        </Link>
        <Link
          onClick={() => this.goTo("/areas")}
          onKeyPress={() => this.goTo("/areas")}
          role="link"
          tabIndex="0"
        >
          Zones
        </Link>

        <Subtitle>Data Filler</Subtitle>
        <Link
          onClick={() => this.goTo("/themes")}
          onKeyPress={() => this.goTo("/themes")}
          role="link"
          tabIndex="0"
        >
          Thèmes
        </Link>
        <Link
          onClick={() => this.goTo("/requests")}
          onKeyPress={() => this.goTo("/requests")}
          role="link"
          tabIndex="0"
        >
          Requêtes
        </Link>
        <Link
          onClick={() => this.goTo("/terms")}
          onKeyPress={() => this.goTo("/terms")}
          role="link"
          tabIndex="0"
        >
          Glossaire
        </Link>

        <Subtitle>Maintenance</Subtitle>
        <Link
          onClick={() => this.goTo("/data-filler")}
          onKeyPress={() => this.goTo("/data-filler")}
          role="link"
          tabIndex="0"
        >
          Data Filler
        </Link>
        <Link
          onClick={() => this.goTo("/logs")}
          onKeyPress={() => this.goTo("/logs")}
          role="link"
          tabIndex="0"
        >
          Logs
        </Link>
        <Link
          onClick={() => this.goTo("/migrations")}
          onKeyPress={() => this.goTo("/migrations")}
          role="link"
          tabIndex="0"
        >
          Migrations
        </Link>
      </div>
    );
  }
}
