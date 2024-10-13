import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { integer, pgTable,  text, boolean, uuid, timestamp, json } from 'drizzle-orm/pg-core';
import { User } from './user.model';
import { Folder } from './folder.model';

type Filters = {
  deleted?: boolean;
  archived?: boolean;
  starred?: boolean;
  pinned?:  boolean;
};

type ListTheme = {
  deleted?: boolean;
  archived?: boolean;
  starred?: boolean;
  pinned?:  boolean;
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
  theme: json('theme').$type<ListTheme>().default({})
});


export type ListInsert = typeof List.$inferInsert;
export type ListSelect = typeof List.$inferSelect;





// Schema for selecting a user - can be used to validate API responses
const selectUserSchema = createSelectSchema(List);


// Refining the fields - useful if you want to change the fields before they become nullable/optional in the final schema
export const ListSchemas =  { 
  insert:  createInsertSchema(List).strict(),
  update:  createInsertSchema(List).omit({id: true}).strict(),
} 


