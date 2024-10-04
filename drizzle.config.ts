import type { Config } from 'drizzle-kit';

export default {
	schema: 'db/schema.ts',
	out: 'drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		host: "127.0.0.1",
		user: "postgres",
		password: "admin",
		database: "tada",
	},
} satisfies Config;