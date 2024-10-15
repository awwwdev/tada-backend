import { createInsertSchema } from 'drizzle-zod';

import { integer, pgTable,  text, boolean, pgEnum, uuid, timestamp, AnyPgColumn } from 'drizzle-orm/pg-core';
import { USER } from './user.model';
import { z } from 'zod';
import { LIST } from './list.model';

export const TaskStatusEnum = pgEnum('task_status', ['to-do', 'done']);

export const TASK = pgTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  label: text('label').notNull(),
  emojis: text('emojis').array(),
  authorId: uuid('author').references(() => USER.id),
  note: text('note'),
  status: TaskStatusEnum('task_status').default('to-do'), // TODO enum
  dueAt: timestamp('due_at'),
  deleted: boolean('deleted').default(false),
  starred: boolean('starred').default(false),
  pinned: boolean('pinned').default(false),
  archived: boolean('archived').default(false),
  stepOf: uuid('step_of').references((): AnyPgColumn => TASK.id),
  stepIndex: integer('step_index'),
  listId: uuid('list_id').references(() => LIST.id),
});


const refinements = {
  emojis: z.array(z.string()).optional(),
  authorId: z.string().uuid(),
  listId: z.string().uuid(),
}

export const taskCreateSchema =  createInsertSchema(TASK, refinements).omit({ id: true, createdAt: true, updatedAt: true }).strict();
export const taskUpdateSchema =  taskCreateSchema.partial();

export type Task = typeof TASK.$inferSelect;
export type NewTask = z.infer<typeof taskCreateSchema>;
export type UpdateTask = z.infer<typeof taskUpdateSchema>;