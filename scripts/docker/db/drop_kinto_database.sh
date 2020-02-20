#!/bin/bash

# Exit when any command fails:
set -e

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL
  DROP DATABASE obxyodufq;
EOSQL
