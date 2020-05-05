# Scripts du dépôt monolithique

```text
├── ci                                            CI scripts
│   ├── deleteYarnLock.js                           Delete Yarn lock file
│   └── removeWorkspaces.js                         Remove Lerna workspaces list in packages.json
├── data                                          Static data scripts
│   ├── code-du-travail-YYYYMMDD.js                 Last version of DILA Labor Code articles extract
│   ├── generateIndex.js                            Generate agreements ID <> articles ID index file
│   └── generateLaborCodeArticles.js                Generate normalized Labor Code articles file
├── db                                            PostgreSQL database scripts
│   ├── backup.js                                   Generate a dump file from the current database
│   ├── generateMigration.js                        Generate files for a new migration
│   ├── getMigrationQuery.js                        Resolve SQL migration files up/down queries
│   └── restore.js                                  Restore a dump file into the database
├── dev                                           Development scripts
│   └── setup.js                                    Fully setup (or reset) a fresh dev environment
└── prod                                          Production scripts
    └── start.sh                                    Build and run a production server instance
```

## Notes

- `deleteYarnLock.js` & `removeWorkspaces.js` are used to avoid the useless packages dependencies
  installation during the first `yarn install` call in production, which makes it faster.
