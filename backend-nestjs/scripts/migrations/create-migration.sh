#!/usr/bin/env bash

set -ex

MIGRATION_NAME=${1?Please provide a name for the migration (start with a capital)}

rm migration.sqlite || true

echo "Running existing migrations"
npx typeorm-ts-node-commonjs migration:run -d scripts/migrations/create-migration-datasource.ts

echo "Creating new migration"
npx typeorm-ts-node-commonjs migration:generate -d scripts/migrations/create-migration-datasource.ts src/database/migrations/${MIGRATION_NAME}Migration

rm migration.sqlite || true