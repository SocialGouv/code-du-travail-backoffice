import Router from "next/router";
import React from "react";

import Menu from "../Menu";
import cache from "../../cache";

import styles from "./styles";

export default class Header extends React.PureComponent {
  goToHome() {
    const me = cache.get("me");

    Router.push(me.isAdmin ? "/admin" : "/");
  }

  render() {
    const me = cache.get("me");

    return (
      <div className="Container">
        <style jsx>{styles}</style>
        <div
          aria-label="Bouton de retour au tableau de bord"
          className="Brand"
          onClick={() => this.goToHome()}
          onKeyUp={() => this.goToHome()}
          role="button"
          tabIndex="0"
        >
          <img
            alt="Code du travail numérique"
            className="BrandLogo"
            src="/static/images/marianne.svg"
          />
          <div className="BrandText">
            <span className="BrandTextTitle">Code du travail numérique</span>
            <span className="BrandTextSubtitle">Outil de contribution</span>
          </div>
        </div>
        {me.isAuthenticated && (
          <div className="User">
            <Menu />
          </div>
        )}
      </div>
    );
  }
}
