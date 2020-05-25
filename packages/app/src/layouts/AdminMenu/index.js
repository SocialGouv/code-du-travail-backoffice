import Router from "next/router";
import React from "react";

import cache from "../../cache";
import { USER_ROLE } from "../../constants";
import isNode from "../../helpers/isNode";
import styles, { Link, Subtitle } from "./styles";

export default class AdminMenu extends React.PureComponent {
  goTo(resource) {
    Router.push(`/admin${resource}`);
  }

  isActive(resource) {
    if (isNode()) {
      return false;
    }

    if (resource.length === 0) {
      return Router.pathname === `/admin` || /^\/admin[^/]+$/.test(Router.pathname);
    }

    return (
      Router.pathname === `/admin${resource}` || Router.pathname.startsWith(`/admin${resource}/`)
    );
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
            data-testid="regional-admin-dashboard"
            isActive={this.isActive("")}
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
          data-testid="admin-dashboard"
          isActive={this.isActive("")}
          onClick={() => this.goTo("")}
          onKeyPress={() => this.goTo("")}
          role="link"
          tabIndex="0"
        >
          Tableau de bord
        </Link>
        <Link
          data-testid="admin-agreements"
          isActive={this.isActive("/agreements")}
          onClick={() => this.goTo("/agreements")}
          onKeyPress={() => this.goTo("/agreements")}
          role="link"
          tabIndex="0"
        >
          Conventions
        </Link>
        <Link
          data-testid="admin-questions"
          isActive={this.isActive("/questions")}
          onClick={() => this.goTo("/questions")}
          onKeyPress={() => this.goTo("/questions")}
          role="link"
          tabIndex="0"
        >
          Questions
        </Link>
        <Link
          data-testid="admin-answers"
          isActive={this.isActive("/answers")}
          onClick={() => this.goTo("/answers")}
          onKeyPress={() => this.goTo("/answers")}
          role="link"
          tabIndex="0"
        >
          Réponses
        </Link>
        <Link
          data-testid="admin-generic-answers"
          isActive={this.isActive("/generic-answers")}
          onClick={() => this.goTo("/generic-answers")}
          onKeyPress={() => this.goTo("/generic-answers")}
          role="link"
          tabIndex="0"
        >
          Réponses génériques
        </Link>
        <Link
          data-testid="admin-locations"
          isActive={this.isActive("/locations")}
          onClick={() => this.goTo("/locations")}
          onKeyPress={() => this.goTo("/locations")}
          role="link"
          tabIndex="0"
        >
          Unités
        </Link>
        <Link
          data-testid="admin-users"
          isActive={this.isActive("/users")}
          onClick={() => this.goTo("/users")}
          onKeyPress={() => this.goTo("/users")}
          role="link"
          tabIndex="0"
        >
          Utilisateurs
        </Link>

        <Subtitle>Scripts</Subtitle>
        <Link
          data-testid="admin-legal-references-migration"
          isActive={this.isActive("/legal-references-migration")}
          onClick={() => this.goTo("/legal-references-migration")}
          onKeyPress={() => this.goTo("/legal-references-migration")}
          role="link"
          tabIndex="0"
        >
          Migrer les références
        </Link>
        <Link
          data-testid="admin-legal-references-migration-fix"
          isActive={this.isActive("/legal-references-migration-fix")}
          onClick={() => this.goTo("/legal-references-migration-fix")}
          onKeyPress={() => this.goTo("/legal-references-migration-fix")}
          role="link"
          tabIndex="0"
        >
          Différences (26/02/2020)
        </Link>

        <Subtitle>Maintenance</Subtitle>
        <Link
          data-testid="admin-logs"
          isActive={this.isActive("/logs")}
          onClick={() => this.goTo("/logs")}
          onKeyPress={() => this.goTo("/logs")}
          role="link"
          tabIndex="0"
        >
          Logs
        </Link>
        <Link
          data-testid="admin-migrations"
          isActive={this.isActive("/migrations")}
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
