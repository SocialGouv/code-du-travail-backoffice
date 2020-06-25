# Contributing

We would love for you to contribute to the backoffice of [Code du travail numérique][link-cdtn] and
help make it even better than it is today!

- [Contribute](#contribute)
  - [Prerequisites](#prerequisites)
  - [Get Started](#get-started)
  - [Test](#test)
  - [Scripts](#scripts)
  - [Recommended IDE Settings](#recommended-ide-settings)
  - [VS Code](#vs-code)
  - [Known Issues](#known-issues)
    - [Docker Compose](#docker-compose)
    - [Jest Watch](#jest-watch)
- [Naming Guidelines](#naming-guidelines)
  - [API-related methods](#api-related-methods)
  - [React methods](#react-methods)
  - [Redux states](#redux-states)
  - [React variables](#react-variables)
- [Commit Message Guidelines](#commit-message-guidelines)
  - [Revert](#revert)
  - [Type](#type)
  - [Scope](#scope)
  - [Subject](#subject)

## Contribute

### Prerequisites

- Docker v19+
- Docker Compose v1.25+
- Node v12+
- Yarn v1.22+

You must be able to run `docker` and `docker-compose` [without `sudo`][link-docker-no-sudo].

### Get Started

```bash
git clone https://github.com/SocialGouv/code-du-travail-backoffice.git
cd code-du-travail-backoffice
yarn
yarn setup
yarn dev
```

The website should now be available at: http://localhost:3100.

5 sample users have been generated during setup:

- Administrator:
  - Email: `doris@sea.com`<br>
    Mot de passe: `Azerty123`
- Regional Administrator:
  - Email: `deb@sea.com`<br>
    Mot de passe: `Azerty123`
- Contributors:
  - Email: `nemo@sea.com`<br>
    Mot de passe: `Azerty123`
  - Email: `astrid@sea.com`<br>
    Mot de passe: `Azerty123`
  - Email: `marin@sea.com`<br>
    Mot de passe: `Azerty123`

### Test

- All Tests: `yarn test`
- Lint Tests: `yarn test:lint`
- Type Tests: `yarn test:type`
- Unit Tests: `yarn test:unit`
- Unit Tests (watch): `yarn test:watch`
- E2E Tests: `yarn test:e2e`

to update Unite Tests snapshots, you can run `yarn test:update`.

### Scripts

This repository comes with multiple useful npm scripts (run via `yarn <script>`):

- `db:backup`: Generate a database dump.
- `db:migrate` Migrate database schema.
- `db:migrate:make`: Create a new database migration file.
- `db:restore`: Restore a database dump.
- `db:seed`: Seed the database via a mix of dummy and real production data.
- `db:snapshot:restore`: Restore the dev database dump.
- `db:snapshot:update`: Update the dev database dump file.
- `dev`: Start a full development instance (including Docker images).
- `dev:docker`: Start dev-related Docker images (with a dev config).
- `dev:packages`: Sun the packages instance in dev (watch + live-reload) mode.
- `setup`: Setup (or refresh) a ready-to-use dev environment.
- `setup:env`: Reset the dev environment variables (via the `.env` file).
- `setup:full`: Setup (or refresh) a ready-to-use dev environment **with** a new seed.<br>
  _This also updates the dev/test database snapshot._
- `start`: Start a full production instance (without Docker images).
- `start:prod`: Run the production build & run script.

### Recommended IDE Settings

### VS Code

`settings.json`

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnPaste": false,
  "editor.formatOnSave": true,
  "editor.rulers": [100],
  "eslint.enable": true
}
```

`extensions.json`

```json
{
  "recommendations": [
    "alexkrechik.cucumberautocomplete",
    "dbaeumer.vscode-eslint",
    "editorconfig.editorconfig",
    "esbenp.prettier-vscode",
    "jpoissonnier.vscode-styled-components",
    "mikestead.dotenv",
    "ms-azuretools.vscode-docker",
    "ryanluker.vscode-coverage-gutters"
  ]
}
```

### Known Issues

#### Docker Compose

Under Ubuntu, if you encounter the error `double free or corruption (out)`, the [current
solution][link-issue-1] is to force-remove the related dependency:

```bash
dpkg -r --force-depends golang-docker-credential-helpers
```

#### Jest Watch

Under Ubuntu, if you encounter the error
`Error: ENOSPC: System limit for number of file watchers reached`, the [current
solution][link-issue-2] is to increase the number of file system watchers:

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

---

## Naming Guidelines

### API-related methods

This includes React methods as well as Redux actions, action types and sagas:

- All `GET` call-related methods must start with the verb **load**.
- All `POST` call-related methods must start with the verb **create**, or **add** if it targets a
  foreign entity (i.e.: `addAnswerComment()`).
- All `PATCH` call-related methods must start with the verb **update**.
- All `DELETE` call-related methods must start with the verb **delete** (or **\_delete**), or
  **remove** if it targets a foreign entity (i.e.: `removeAnswerComment()`).

### React methods

- All the methods returning a JSX value should start with the verb **render**.

### Redux states

A common state should look like:

```ts
interface {
  /** Single entity data (creation, edition) */
  data: Object | null;
  error: Error | null;
  /** Is it fetching data? */
  isLoading: boolean;
  /**
    Total number of entities (listing)

    @description
    This represents the number of entities available on the API and should be higher than the list
    length if there is more than one page.
  */
  length: number;
  /** Multiple entities data (listing) */
  list: Object[];
  /** Current page index (listing) */
  pagesIndex: number;
  /** Total number of pages (listing) */
  pagesLength: number;
}
```

### React variables

- All the variables referencing a component must start with **$**
  (i.e.: `<Button ref={node => this.$button = node}>`).

---

## Commit Message Guidelines

Each commit message consists of a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
```

The **type** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

**Examples:**

- `docs(changelog): update changelog to 1.12.5`
- `fix(release): need to depend on latest rxjs and zone.js`
- `ci(codecov): configure dependabot`

Do not hesitate check [existing commits][link-cdtb-commits] to get a better understanding.

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of
the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the
SHA of the commit being reverted.

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies.
- **chore**: Updates and upgrades.
- **ci**: Changes to our CI configuration files and scripts.
- **docs**: Documentation only changes.
- **feat**: A new feature.
- **fix**: A bug fix.
- **perf**: A code change that improves performance.
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **style**: Changes that do not affect the meaning of the code.
- **test**: Adding missing tests or correcting existing tests.

### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the
changelog generated from commit messages.

The following is the list of supported scopes:

- **api**
- **app**

### Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes".
- Don't capitalize the first letter.
- No dot (.) at the end.

---

[link-cdtb-commits]: https://github.com/SocialGouv/code-du-travail-backoffice/commits/master
[link-cdtn]: https://code.travail.gouv.fr
[link-docker-no-sudo]: https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user
[link-issue-1]: https://github.com/docker/docker-credential-helpers/issues/103#issuecomment-421822269
[link-issue-2]: https://github.com/facebook/jest/issues/3254#issuecomment-297214395
