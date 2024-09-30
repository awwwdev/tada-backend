import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "../config";

let dsl: PostgresJsDatabase<Record<string, unknown>>;

const getDBClient = () => {
  if (!dsl) {
    const connection = postgres(config().POSTGRESQL_CONNECTION_STRING);
    dsl = drizzle(connection);
  }
  return dsl;
};

export default getDBClient;
