# Back-office du code du travail numérique

[![Travis CI Status][img-travis]][link-travis]
[![Coveralls Code Coverage][img-coveralls]][link-coveralls]

Ce dépôt regroupe les applications d'administration des données du [code du travail
numérique][link-cdtn].

---

## Contribuer au projet

### Pré-requis

- Docker v19+
- Docker Compose v1.24+
- Node v12+
- Yarn v1.21+

### Installation

```bash
git clone https://github.com/SocialGouv/code-du-travail-backoffice.git
cd code-du-travail-backoffice
yarn
# Build, migrate and seed the database (PostgreSQL), as well as the apis (PostgREST & Kinto):
yarn setup
# Start the containers and run packages code in dev mode (with watch & hot reload):
yarn dev
```

> 📓 Si vous ne pouvez exécuter `docker-compose` qu'avec `sudo`, vous devez remplacer tous les
> `docker-compose` par `sudo docker-compose`.

Le site devrait être accessible à l'adresse http://localhost:3100.

3 utilisatrices ont été générées par défaut pendant l'installation :

- Administratrice:
  - Email: `doris@sea.com`
  - Mot de passe: `Azerty123`
- Administratrice régionale:
  - Email: `deb@sea.com`
  - Mot de passe: `Azerty123`
- Contributeur:
  - Email: `nemo@sea.com`
  - Mot de passe: `Azerty123`

**Recommended VS Code settings**

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnSaveTimeout": 2000,
  "eslint.nodePath": "./packages/contrib/node_modules",
  "eslint.workingDirectories": [
    {
      "directory": "./packages/api",
      "changeProcessCWD": true
    },
    {
      "directory": "./packages/contrib",
      "changeProcessCWD": true
    },
    {
      "directory": "./packages/data-filler",
      "changeProcessCWD": true
    }
  ]
}
```

### Démarrer le site localement

Un fois installé, vous pouvez simplement faire tourner le site en exécutant cette commande :

```bash
yarn dev
```

Le site devrait être accessible à l'adresse [http://localhost:3100](http://localhost:3100).

### Tester le code

#### Test unitaires

Durant le développement, vous pouvez soit tester manuellement :

```bash
yarn test:unit
```

soit faire tourner les tests unitaires en continu :

```bash
yarn test:watch
```

#### Analyse statique

Vous pouvez exécuter l'analyse statique du code en exécutant :

```bash
yarn test:lint
```

#### Tests de bout en bout

Vous pouvez exécuter les tests de bout en bout du code en exécutant (votre site doit d'abord être
démarré localement) :

```bash
yarn test:e2e
```

### Problèmes connus

#### Docker Compose

Sous Ubuntu, si vous rencontrez l'erreur `double free or corruption (out)`, la [solution
actuelle][link-issue-1] consiste à forcer la désinstallation de la dépendance concernée :

```bash
dpkg -r --force-depends golang-docker-credential-helpers
```

#### Jest Watch

Sous Ubuntu, si vous rencontrez l'erreur
`Error: ENOSPC: System limit for number of file watchers reached`, la [solution
actuelle][link-issue-2] consiste à augmenter le nombre de watchers du système de fichiers en
exécutant :

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### License

Le code source de ce dépôt est distribué sous la [licence Apache 2.0][link-license].

---

[img-coveralls]:
  https://img.shields.io/coveralls/github/SocialGouv/code-du-travail-backoffice?style=flat-square
[img-travis]:
  https://img.shields.io/travis/SocialGouv/code-du-travail-backoffice/dev.svg?style=flat-square
[link-cdtn]: https://codedutravail.num.social.gouv.fr
[link-coveralls]: https://coveralls.io/github/SocialGouv/code-du-travail-backoffice
[link-issue-1]:
  https://github.com/docker/docker-credential-helpers/issues/103#issuecomment-421822269
[link-issue-2]: https://github.com/facebook/jest/issues/3254#issuecomment-297214395
[link-license]: https://github.com/SocialGouv/code-du-travail-backoffice/blob/master/LICENSE
[link-travis]: https://travis-ci.com/SocialGouv/code-du-travail-backoffice
