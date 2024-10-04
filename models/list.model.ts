// import { HydratedDocument, InferRawDocType, Schema, model } from 'mongoose';
// Schema


import { integer, pgTable, serial, text, boolean, uuid, timestamp, json } from 'drizzle-orm/pg-core';
import { User } from './user.model';
import { Folder } from './folder.model';

type Filters = {
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
  emojies: text('emojies').array(),
  authorId: uuid('author_id').references(() => User.id),
  description: text('description'),
  folderId: uuid('folder_id').references(() => Folder.id),
  show: boolean('show'),
  orderInFolder: integer('order_in_panel'),
  // filters: json('filters').$type<Filters>().default({})
});


export type ListInsert = typeof List.$inferInsert;
export type ListSelect = typeof List.$inferSelect;



// const schemaDefinition = {
//   name: { type: String, required: true },
//   emojies: [{ type: String, required: false }],
//   author: { type: Schema.ObjectId, required: true, ref: 'User' },
//   description: { type: String, required: false },
//   folderId: { type: Schema.ObjectId, required: false, ref: 'Folder' },
//   tasks: [
//     {
//       id: { type: Schema.ObjectId, ref: 'Task' },
//       task: { type: Schema.ObjectId, ref: 'Task' },
//       orderInList: { type: Number, required: false },
//       addedAt: { type: Date, required: true },
//     },
//   ],
// } as const;
// export const ListScehma = new Schema(schemaDefinition, { timestamps: true });
// ListScehma.set('toJSON', {
//   virtuals: true,
// });
// export const ListOLD = model('List', ListScehma);
// export type TListRaw = InferRawDocType<typeof schemaDefinition>;
// export type TList = HydratedDocument<TListRaw>;
