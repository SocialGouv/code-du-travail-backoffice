# Scripts du dépôt monolithique

```text
├── ci                                Travis CI scripts
│   ├── install_docker_compose.sh       Install Docker Compose
│   ├── run_full_server_instance.sh     Run a production-like instance
│   └── stop_postgre_service.sh         Gracefully stop Postgre service
├── db                                PostgreSQL database scripts
│   ├── generateMigration.js            Generate files for a new migration
│   └── getMigrationQuery.js            Resolve SQL migration files up/down queries
└── prod                              Production scripts
    └── start.sh                        Main script building and running the server instance
```
