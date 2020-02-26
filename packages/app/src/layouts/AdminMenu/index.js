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

        <Subtitle>Data Filler</Subtitle>
        <Link
          onClick={() => this.goTo("/definitions")}
          onKeyPress={() => this.goTo("/definitions")}
          role="link"
          tabIndex="0"
        >
          Définitions
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
          onClick={() => this.goTo("/themes")}
          onKeyPress={() => this.goTo("/themes")}
          role="link"
          tabIndex="0"
        >
          Thèmes
        </Link>

        <Subtitle>Scripts</Subtitle>
        <Link
          onClick={() => this.goTo("/legal-references-migration")}
          onKeyPress={() => this.goTo("/legal-references-migration")}
          role="link"
          tabIndex="0"
        >
          Migrer les références
        </Link>

        <Subtitle>Maintenance</Subtitle>
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
