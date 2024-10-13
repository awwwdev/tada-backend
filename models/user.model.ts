import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import {  pgTable,  text, uuid, customType, timestamp, json } from 'drizzle-orm/pg-core';
// import * as x from 'drizzle-orm/

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return 'bytea';
  },
});

type Settings = {
  showCompletedTasks?: boolean;
  theme?: 'light' | 'dark' | 'system';
  startOfWeek?: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
};

export const User = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  username: text('username').unique(),
  email: text('email').unique().notNull(),
  passwordHash: bytea('password_hash').notNull(),
  salt: bytea('salt').notNull(),
  settings: json('settings')
    .$type<Settings>()
    .default({ theme: 'system', showCompletedTasks: true, startOfWeek: 'sunday' }),
});

export type UserInsert = typeof User.$inferInsert;
export type UserSelect = typeof User.$inferSelect;

export const selectUserSchema = createSelectSchema(User);

export const insertUserSchema = createInsertSchema(User, {
  email: (schema) => schema.email.email('Please provide a valid email.'),
  username: (schema) =>
    schema.username
      .min(3, 'Username must be at least 3 characters long.')
      .max(25, 'Username must be at most 25 characters long.'),
});

// Usage

const user = insertUserSchema.parse({
  name: 'John Doe',
  email: 'johndoe@test.com',
  role: 'admin',
});

// Zod schema type is also inferred from the table schema, so you have full type safety
// const requestSchema = insertUserSchema.pick({ name: true, email: true });
