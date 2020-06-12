import Router, { withRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";

import cache from "../../cache";
import { USER_ROLE } from "../../constants";
import { Container, Link, Subtitle } from "./index.style";

export class AdminMenu extends React.PureComponent {
  goTo(path) {
    Router.push(`/admin${path}`);
  }

  isActive(path) {
    const { router } = this.props;

    // For tests purpose:
    /* istanbul ignore next */
    if (router === undefined) {
      return false;
    }

    if (path === "") {
      return router.pathname === `/admin` || /^\/admin[^/]+$/.test(router.pathname);
    }

    return router.pathname === `/admin${path}` || router.pathname.startsWith(`/admin${path}/`);
  }

  renderLink(path, text, dataTestId) {
    return (
      <Link
        data-testid={dataTestId}
        isActive={this.isActive(path)}
        onClick={() => this.goTo(path)}
        onKeyPress={() => this.goTo(path)}
        role="link"
        tabIndex="0"
      >
        {text}
      </Link>
    );
  }

  render() {
    const me = cache.get("me");

    if (me === null) {
      return <Container />;
    }

    const isRegionalAdmin = me.role === USER_ROLE.REGIONAL_ADMINISTRATOR;

    if (isRegionalAdmin) {
      return (
        <Container>{this.renderLink("", "Tableau de bord", "regional-admin-dashboard")}</Container>
      );
    }

    return (
      <Container>
        {this.renderLink("", "Tableau de bord", "admin-dashboard")}
        {this.renderLink("/agreements", "Conventions", "admin-agreements")}
        {this.renderLink("/questions", "Questions", "admin-questions")}
        {this.renderLink("/answers-references", "Références légales", "admin-answers-references")}
        {this.renderLink("/answers", "Réponses", "admin-answers")}
        {this.renderLink("/generic-answers", "Réponses génériques", "admin-generic-answers")}
        {this.renderLink("/locations", "Unités", "admin-locations")}
        {this.renderLink("/users", "Utilisateurs", "admin-users")}

        <Subtitle>Scripts</Subtitle>
        {this.renderLink(
          "/legal-references-migration",
          "Migrer les références",
          "admin-legal-references-migration",
        )}
        {this.renderLink(
          "/legal-references-migration-fix",
          "Différences (26/02/2020)",
          "admin-legal-references-migration-fix",
        )}

        <Subtitle>Maintenance</Subtitle>
        {this.renderLink("/logs", "Logs", "admin-logs")}
        {this.renderLink("/migrations", "Migrations", "admin-migrations")}
      </Container>
    );
  }
}

AdminMenu.propTypes = {
  router: PropTypes.any,
};

export default withRouter(AdminMenu);
