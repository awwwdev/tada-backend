// import { HydratedDocument, InferRawDocType, Schema, model } from 'mongoose';



import { integer, pgTable,  text , boolean, uuid , timestamp  } from 'drizzle-orm/pg-core';
import { User } from './user.model';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const Folder = pgTable('folder', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  name: text('name').notNull(),
	emojis: text('emojis').array(),
	authorId: uuid('author_id').references(() => User.id),
  show: boolean('show'),
  orderInPanel: integer('order_in_panel'),
});


export type FolderInsert = typeof Folder.$inferInsert;
export type FolderSelect = typeof Folder.$inferSelect;

const refinements = {
  emojis: z.array(z.string()).optional(),
  authorId: z.string().uuid(),
}

export const folderCreateSchema =  createInsertSchema(Folder, refinements).omit({ id: true, createdAt: true, updatedAt: true }).strict();
export const folderUpdateSchema =  folderCreateSchema.partial();