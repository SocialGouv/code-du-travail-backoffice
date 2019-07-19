# Back-office du code du travail numérique

[![Travis CI Status][img-travis]][link-travis]
[![Codecov Code Coverage][img-codecov]][link-codecov]
[![Codacy Code Quality][img-codacy]][link-codacy]

Ce dépôt regroupe les applications d'administration des données du
[code du travail numérique][link-cdtn].

---

## Contribuer au projet

### Pré-requis

- Node v10+
- Docker v18+
- Docker Compose v1.17+
- Yarn (`npm i -g yarn`)

### Installation

```bash
git clone https://github.com/SocialGouv/code-du-travail-backoffice.git
cd code-du-travail-backoffice
yarn
# Install all the packages dependencies (since it's a monorepo):
yarn lerna bootstrap
# Generates the .env file with pre-filled dev/test values:
yarn setup --env-only
docker-compose up -d db
yarn db:migrate
# Seed the databse with dev/test dummy data:
yarn db:seed
docker-compose up -d api
yarn dev
```

> **Note**<br>
> Si vous ne pouvez exécuter `docker-compose` qu'avec `sudo`, vous devez
> remplacer tous les `docker-compose` par `sudo docker-compose`.

Le site devrait être accessible à l'adresse http://localhost:3100.

2 utilisateurs ont été générés par défaut pendant l'installation :

- Administrateur:
    - Email: `administrator@example.com`
    - Mot de passe: `Azerty123`
- Contributeur:
    - Email: `contributor@example.com`
    - Mot de passe: `Azerty123`

### Démarrer le site localement

Un fois installé, vous pouvez simplement faire tourner le site avec ces deux
commandes :

```bash
docker-compose up -d api
yarn dev
```

Le site devrait être accessible à l'adresse
[http://localhost:3100](http://localhost:3100).

### Tester le code

#### Test unitaires

Pendant le développement, vous pouvez soit tester manuellement :

```bash
yarn test:unit
```

soit faire tourner les tests unitaires en continu (ajouter `--coverage` pour
afficher l'état de couverture des tests) :

```bash
yarn test:watch
```

#### Analyse statique

Vous pouvez exécuter l'analyse statique du code en exécutant :

```bash
yarn test:lint
```

#### Tests de bout en bout

Vous pouvez exécuter les tests de bout en bout du code en exécutant (votre site
doit alors touner localement) :

```bash
yarn test:e2e
```

Vous pouvez aussi simuler l'exécution des tests bout en bout tels qu'ils sont
exécutés par la CI (en mode production et entièrement docker-isés):

```bash
yarn ci:test:e2e
```

> **Attention**<br>
> La deuxième méthode va effacer toutes les données de votre base de données
> contenues dans votre volume Docker local (cf. `docker-compose.yml`).

### Problèmes connus	

#### Docker Compose

Sous Ubuntu, si vous rencontrez l'erreur `double free or corruption (out)`, la
[solution actuelle][link-issue-1] consiste à forcer la désinstallation de la
dépendance concernée :

```bash
dpkg -r --force-depends golang-docker-credential-helpers
```

#### Jest Watch

Sous Ubuntu, si vous rencontrez l'erreur	`Error: ENOSPC: System limit for
number of file watchers reached`, la [solution	actuelle][link-issue-2] consiste
à augmenter le nombre de watchers du système de fichiers en exécutant :	

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p	
```

### License

Le code source de ce dépôt est distribué sous la
[licence Apache 2.0][link-license].

---

[img-codacy]: https://img.shields.io/codacy/grade/4c5aebc238b94d3795371b49fa6041de.svg?style=flat-square
[img-codecov]: https://img.shields.io/codecov/c/github/SocialGouv/code-du-travail-backoffice/dev.svg?style=flat-square
[img-travis]: https://img.shields.io/travis/SocialGouv/code-du-travail-backoffice/dev.svg?style=flat-square

[link-cdtn]: https://codedutravail.num.social.gouv.fr
[link-codacy]: https://app.codacy.com/project/SocialGouv/code-du-travail-backoffice/dashboard
[link-codecov]: https://codecov.io/gh/SocialGouv/code-du-travail-backoffice
[link-issue-1]: https://github.com/docker/docker-credential-helpers/issues/103#issuecomment-421822269
[link-issue-2]: https://github.com/facebook/jest/issues/3254#issuecomment-297214395
[link-license]: https://github.com/SocialGouv/code-du-travail-backoffice/blob/master/LICENSE
[link-travis]: https://travis-ci.com/SocialGouv/code-du-travail-backoffice
