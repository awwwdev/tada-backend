// import { HydratedDocument, InferRawDocType, Schema, model } from 'mongoose';



import { integer, pgTable, text, boolean, uuid, timestamp } from 'drizzle-orm/pg-core';
import { USER } from './user.model';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const FOLDER = pgTable('folder', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  name: text('name').notNull(),
  emojis: text('emojis').array(),
  authorId: uuid('author_id').references(() => USER.id),
  show: boolean('show'),
  orderInPanel: integer('order_in_panel'),
});



const refinements = {
  emojis: z.array(z.string()).optional(),
  authorId: z.string().uuid(),
}

export const folderCreateSchema = createInsertSchema(FOLDER, refinements).omit({ id: true, createdAt: true, updatedAt: true }).strict();
export const folderUpdateSchema = folderCreateSchema.partial();

export type Folder = typeof FOLDER.$inferSelect;
export type NewFolder = z.infer<typeof folderCreateSchema>;
export type UpdateFolder = z.infer<typeof folderUpdateSchema>;