# Contributing

We would love for you to contribute to the backoffice of [Code du travail numérique][link-cdtn] and
help make it even better than it is today!

- [Contribute](#contribute)
  - [Prerequisites](#prerequisites)
  - [Get Started](#get-started)
  - [Standalone](#standalone)
  - [Test](#test)
  - [Scripts](#scripts)
  - [Recommended IDE Settings](#recommended-ide-settings)
  - [VS Code](#vs-code)
  - [Known Issues](#known-issues)
    - [Docker Compose](#docker-compose)
    - [Jest Watch](#jest-watch)
- [Common Tasks](#common-tasks)
  - [Database backup in production](#database-backup-in-production)
  - [Database restore in production](#database-restore-in-production)
  - [Database snapshot update in development](#database-snapshot-update-in-development)
  - [Database snapshot restore in development](#database-snapshot-restore-in-development)
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

The website should now be available at: <http://localhost:3100>.

5 sample users have been generated during setup:

- Administrator:
  - Email: `doris@sea.com`  
    Mot de passe: `Azerty123`
- Contributors:
  - Email: `nemo@sea.com`  
    Mot de passe: `Azerty123`

### Standalone

Standalone dev also runs [**ctdn-api**](https://github.com/SocialGouv/cdtn-api) locally:

First, change `CDTN_API_URL` value to `http://localhost:3300` in `.env` file.

Then run:

```sh
yarn dev:standalone
```

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
- `start`: Start a full production instance (without Docker images).
- `start:prod`: Run the production build & run script.

### Recommended IDE Settings

### VS Code

`settings.json`

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.formatOnSave": true,
  "eslint.codeActionsOnSave.mode": "all",
  "eslint.format.enable": true,
  "eslint.packageManager": "yarn",
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
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

## Common Tasks

### Database backup in production

```sh
yarn db:backup
```

will dump your Docker database generating a local `./backups/YYYY_MM_DD.sql` PosgreSQL dump file.

### Database restore in production

Supposing you have, for example, a `./backups/2021_12_10.sql` PosgreSQL dump file:

```sh
yarn db:restore 2021_12_10
```

will automatically restore this backup into your Docker database.

### Database snapshot update in development

To fasten CI and dev setup with real production PostgreSQL data, we use snapshots that are in fact
PostgreSQL dump files (taken from production backups) in which we inject a fake administrator and
contributor generated in order to use them locally (without the need to import the production
`PGRST_JWT_SECRET` environment variable which would pose a security threat).

First run a db:backup in production and download this file locally in `./backups`, then run:

```sh
yarn db:snapshot:update YYYY_MM_DD
```

This command will update `./db/snapshot.sql` with anonymzed users data and real password replaced by
fake ones. This file should be included in your git commits since this file must be shared between
developers and is also used for CI tests.

### Database snapshot restore in development

See the explanations above to understand the purpose of a database snapshot.

You shouldn't have to run this command alone since it's already run when you run a `yarn setup` but
in some case you can manually run it via:

```sh
yarn db:snapshot:restore
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

```text
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
