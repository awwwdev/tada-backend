// import { HydratedDocument, InferRawDocType, Schema, model } from 'mongoose';



import { integer, pgTable, serial, text , boolean, uuid , timestamp  } from 'drizzle-orm/pg-core';
import { User } from './user.model';

export const Folder = pgTable('folder', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  name: text('name').notNull(),
	emojies: text('emojies').array(),
	authorId: uuid('author_id').references(() => User.id),
  show: boolean('show'),
  orderInPanel: integer('order_in_panel'),
});


export type FolderInsert = typeof Folder.$inferInsert;
export type FolderSelect = typeof Folder.$inferSelect;

// // Schema
// const schemaDefinition = {
//   name: { type: String, required: true },
//   emojies: [{ type: String, required: false }],
//   author: { type: Schema.ObjectId, required: true, ref: 'User' },
//   show: { type: Boolean, required: false },
//   orderInPanel: { type: Number, required: false },
//   lists: [
//     {
//       id: { type: Schema.ObjectId, ref: 'List', required: true },
//       show: { type: Boolean, required: false },
//       orderInFolder: { type: Number, required: false },
//       addedAt: { type: Date, required: true },
//     },
//   ],
// } as const;
// export const FolderScehma = new Schema(schemaDefinition, { timestamps: true });
// FolderScehma.set('toJSON', {
//   virtuals: true,
// });
// export const FolderOLD = model('Folder', FolderScehma);
// export type TFolderRaw = InferRawDocType<typeof schemaDefinition>;
// export type TFodler = HydratedDocument<TFolderRaw>;
