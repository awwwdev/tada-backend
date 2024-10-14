import { createInsertSchema } from 'drizzle-zod';

import { integer, pgTable, text, boolean, uuid, timestamp, json } from 'drizzle-orm/pg-core';
import { User } from './user.model';
import { Folder } from './folder.model';
import { z } from 'zod';

type Filters = {
  deleted?: boolean;
  archived?: boolean;
  starred?: boolean;
  pinned?: boolean;
};

type ListTheme = {
  hue?: string;
  darkMode?: boolean;
};

export const List = pgTable('list', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  name: text('name').notNull(),
  emojis: text('emojis').array(),
  authorId: uuid('author_id').references(() => User.id),
  description: text('description'),
  folderId: uuid('folder_id').references(() => Folder.id),
  show: boolean('show'),
  orderInFolder: integer('order_in_folder'),
  theme: json('theme').$type<ListTheme>().default({}),
});

export type ListSelect = typeof List.$inferSelect;

const refinements = {
  theme: z.object({
    hue: z.string().optional(),
    darkMode: z.boolean().optional(),
  }),
  emojis: z.array(z.string()).optional(),
}

export const listCreateSchema =  createInsertSchema(List, refinements).omit({ id: true, createdAt: true, updatedAt: true }).strict();
export const listUpdateSchema =  listCreateSchema.partial();
