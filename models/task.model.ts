import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { integer, pgTable, serial, text, boolean, pgEnum, uuid, timestamp, AnyPgColumn } from 'drizzle-orm/pg-core';
import { User } from './user.model';
import { List } from './list.model';

export const TaskStatusEnum = pgEnum('task_status', ['to-do', 'done']);

export const Task = pgTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  label: text('label').notNull(),
  emojis: text('emojis').array(),
  authorId: uuid('author').references(() => User.id),
  note: text('note'),
  status: TaskStatusEnum('task_status').default('to-do'), // TODO enum
  dueAt: timestamp('due_at'),
  deleted: boolean('deleted').default(false),
  starred: boolean('starred').default(false),
  pinned: boolean('pinned').default(false),
  archived: boolean('archived').default(false),
  stepOf: uuid('step_of').references((): AnyPgColumn => Task.id),
  stepIndex: integer('step_index'),
  listId: uuid('list_id').references(() => List.id),
});

export type TaskInsert = typeof Task.$inferInsert;
export type TaskSelect = typeof Task.$inferSelect;

export const selectUserSchema = createSelectSchema(Task);

export const insertUserSchema = createInsertSchema(Task, {

});
