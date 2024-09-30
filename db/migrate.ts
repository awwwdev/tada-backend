import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import config from '../config';
import getDBClient from '../db/client';

export const migrationConnection = postgres(config().POSTGRESQL_CONNECTION_STRING, { max: 1 });

async function migrator() {
  const dbClient = getDBClient();
  // This will run migrations on the database, skipping the ones already applied
  await migrate(dbClient, { migrationsFolder: './drizzle' });

  // Don't forget to close the connection, otherwise the script will hang
  await migrationConnection.end();
}

console.log('Migrating database');
migrator();
console.log('Database migrated successfully');
