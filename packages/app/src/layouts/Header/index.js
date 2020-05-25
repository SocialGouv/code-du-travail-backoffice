import Router from "next/router";
import React from "react";

import cache from "../../cache";
import MarianneSvg from "../../svgs/Marianne";
import Menu from "../Menu";
import styles, { Brand } from "./styles";

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
        <Brand
          alignItems="center"
          aria-label="Bouton de retour au tableau de bord"
          data-testid="brand"
          onClick={() => this.goToHome()}
          onKeyUp={() => this.goToHome()}
          role="button"
          tabIndex="0"
        >
          <MarianneSvg className="BrandLogo" />
          <div className="BrandText">
            <span className="BrandTextTitle">Code du travail numérique</span>
            <span className="BrandTextSubtitle">Outil de contribution</span>
          </div>
        </Brand>
        {me.isAuthenticated && (
          <div className="User">
            <Menu />
          </div>
        )}
      </div>
    );
  }
}
