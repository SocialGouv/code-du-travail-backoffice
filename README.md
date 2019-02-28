# Back-office du code du travail numérique

[![Build Status][img-travis]][link-travis]
[![codecov][img-codecov]][link-codecov]

> Ce dépôt regroupe les applications d'administration des données du [code du
> travail numérique][link-cdtn].

## Contribuer au projet

> ### :warning: Travail en cours
> Ce dépôt n'est pas encore fonctionnel.

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
yarn setup
```

> **Note**<br>
> Si vous ne pouvez exécuter `docker-compose` qu'avec `sudo`, vous devez
> remplacer `yarn setup` par `sudo yarn setup`. La logique est similaire si
> vous utilisez Windows et nécessitez de démarrer `docker-compose` en tant
> qu'administrateur.

### Démarrer le site localement

Dans 2 sessions de terminal differentes:

```bash
docker-compose up
```

```bash
yarn dev
```

Et c'est tout! Le site devrait être accessible via http://localhost:3100.

### Problèmes connus

Sous Linux, si vous rencontrez l'erreur
`Error: ENOSPC: System limit for number of file watchers reached`, la [solution
actuelle](https://github.com/facebook/jest/issues/3254#issuecomment-297214395)
consiste à augmenter le nombre de watchers du système de fichiers en exécutant:

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

## Licence

Ce dépôt est licencié sous la [licence Apacha 2.0][link-license].

[img-codecov]: https://img.shields.io/codecov/c/github/SocialGouv/code-du-travail-backoffice/master.svg?style=flat-square
[img-travis]: https://img.shields.io/travis/SocialGouv/code-du-travail-backoffice/master.svg?style=flat-square
[link-cdtn]: https://github.com/SocialGouv/code-du-travail-numerique
[link-codecov]: https://codecov.io/gh/SocialGouv/code-du-travail-backoffice
[link-license]: https://github.com/SocialGouv/code-du-travail-backoffice/blob/master/LICENSE
[link-postgrest]: http://postgrest.org
[link-travis]: https://travis-ci.org/SocialGouv/code-du-travail-backoffice
