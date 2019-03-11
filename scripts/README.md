# Scripts du dépôt monolithique

```
├── ci                                Travis CI scripts
│   ├── install_docker_compose.sh       Install Docker Compose
│   ├── run_full_server_instance.sh     Run a production-like instance
│   └── stop_postgre_service.sh         Gracefully stop Postgre service
├── db                                PostgreSQL database scripts
│   ├── generateMigration.js            Generate files for a new migration
│   └── getMigrationQuery.js            Resolve SQL migration files up/down queries
├── prod                              Production scripts
│   └── start.sh                        Main script building and running the server instance
└── setup                             Development-related automated setup scripts
    ├── index.js                        Main setup script
    ├── migrateDb.js                    Run PostgreSQL migrations
    ├── runDockerCompose.js             Start and handle a Docker Compose child process
    └── seedDb.js                       Seed PostgreSQL database
```
