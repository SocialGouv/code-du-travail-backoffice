import Router from "next/router";
import React from "react";

import cache from "../../cache";
import { USER_ROLE } from "../../constants";

import styles, { Link, Subtitle } from "./styles";

export default class AdminMenu extends React.PureComponent {
  goTo(resource) {
    Router.push(`/admin${resource}`);
  }

  isActive() {
    return false;
    // const { pathname } = window.location;
    // const regexp =
    //   path.length > 0 ? new RegExp(`^/admin${path}(?=/|$)`) : /^\/admin$/;

    // return regexp.test(pathname);
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
          isActive={this.isActive("")}
          onClick={() => this.goTo("")}
          onKeyPress={() => this.goTo("")}
          role="link"
          tabIndex="0"
        >
          Tableau de bord
        </Link>
        <Link
          isActive={this.isActive("/agreements")}
          onClick={() => this.goTo("/agreements")}
          onKeyPress={() => this.goTo("/agreements")}
          role="link"
          tabIndex="0"
        >
          Conventions
        </Link>
        <Link
          isActive={this.isActive("/tags")}
          onClick={() => this.goTo("/tags")}
          onKeyPress={() => this.goTo("/tags")}
          role="link"
          tabIndex="0"
        >
          Étiquettes
        </Link>
        <Link
          isActive={this.isActive("/tags-categories")}
          onClick={() => this.goTo("/tags-categories")}
          onKeyPress={() => this.goTo("/tags-categories")}
          role="link"
          tabIndex="0"
        >
          └ Catégories
        </Link>
        <Link
          isActive={this.isActive("/questions")}
          onClick={() => this.goTo("/questions")}
          onKeyPress={() => this.goTo("/questions")}
          role="link"
          tabIndex="0"
        >
          Questions
        </Link>
        <Link
          isActive={this.isActive("/answers")}
          onClick={() => this.goTo("/answers")}
          onKeyPress={() => this.goTo("/answers")}
          role="link"
          tabIndex="0"
        >
          Réponses
        </Link>
        <Link
          isActive={this.isActive("/generic-answers")}
          onClick={() => this.goTo("/generic-answers")}
          onKeyPress={() => this.goTo("/generic-answers")}
          role="link"
          tabIndex="0"
        >
          Réponses génériques
        </Link>
        <Link
          isActive={this.isActive("/locations")}
          onClick={() => this.goTo("/locations")}
          onKeyPress={() => this.goTo("/locations")}
          role="link"
          tabIndex="0"
        >
          Unités
        </Link>
        <Link
          isActive={this.isActive("/users")}
          onClick={() => this.goTo("/users")}
          onKeyPress={() => this.goTo("/users")}
          role="link"
          tabIndex="0"
        >
          Utilisateurs
        </Link>
        <Link
          isActive={this.isActive("/areas")}
          onClick={() => this.goTo("/areas")}
          onKeyPress={() => this.goTo("/areas")}
          role="link"
          tabIndex="0"
        >
          Zones
        </Link>

        <Subtitle>Maintenance</Subtitle>
        <Link
          isActive={this.isActive("/data-filler")}
          onClick={() => this.goTo("/data-filler")}
          onKeyPress={() => this.goTo("/data-filler")}
          role="link"
          tabIndex="0"
        >
          Data Filler
        </Link>
        <Link
          isActive={this.isActive("/logs")}
          onClick={() => (window.location.href = "/admin/logs")}
          onKeyPress={() => this.goTo("/logs")}
          role="link"
          tabIndex="0"
        >
          Logs
        </Link>
        <Link
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
