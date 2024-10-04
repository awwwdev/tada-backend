// import { HydratedDocument, InferRawDocType, Schema, model } from 'mongoose';

import { integer, pgTable, serial, text, boolean, pgEnum, uuid, timestamp, AnyPgColumn } from 'drizzle-orm/pg-core';
import { User } from './user.model';
import { List } from './list.model';

export const TaskStatusEnum = pgEnum('task_status', ['to-do', 'done']);

export const Task = pgTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  label: text('label').notNull(),
  emojies: text('emojies').array(),
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

// // Schema
// const schemaDefinition = {
//   label: { type: String, required: true },
//   emojies: [{ type: String, required: false }],
//   author: { type: Schema.ObjectId, required: true, ref: 'User' },
//   note: { type: String, required: false },
//   // author: { type: Schema.ObjectId, required: true, ref: 'User' },
//   // lists: [
//   //   {
//   //     id: { type: Schema.ObjectId, ref: 'List' },
//   //     orderInList: { type: Number, required: false },
//   //     addedAt: { type: Date, required: true },
//   //   },
//   // ],
//   status: {
//     type: String,
//     required: true,
//     enum: ['to-do', 'done'],
//   },
//   dueAt: { type: Date, required: false },
//   deleted: { type: Boolean, required: false },
//   starred: { type: Boolean, required: false },
//   pinned: { type: Boolean, required: false },
//   archived: { type: Boolean, required: false },

//   steps: [{ type: Schema.ObjectId, ref: 'Task' }],
//   preTasks: [{ type: Schema.ObjectId, ref: 'Task' }],
//   postTasks: [{ type: Schema.ObjectId, ref: 'Task' }],
//   comments: [
//     {
//       author: { type: Schema.ObjectId, ref: 'User' },
//       body: { type: String, required: true },
//       createdAt: { type: Date, required: true },
//       // replyToCommentId: { type: Schema.ObjectId, ref: 'Comment' },
//     },
//   ],
//   assingnees: [
//     {
//       authorId: { type: Schema.ObjectId, ref: 'User' },
//       createdAt: { type: Date, required: true },
//     },
//   ],
//   attachments: [
//     {
//       authorId: { type: Schema.ObjectId, ref: 'User' },
//       body: { type: String, required: true },
//       createdAt: { type: Date, required: true },
//     },
//   ],
//   reminders: [{
//     minutesBeforeDueDate: { type: Number, required: true },
//     remindAt: { type: Date, required: true },
//   }],
//   routins: [
//     {
//       startAt: { type: Date, required: true },
//       endAt: { type: Date, required: true },
//       numberOfRepeats: { type: Number, required: true },
//       periods: {
//         type: Number, required: true,
//         enum: ['minute', 'hour', 'day', 'week', 'month', 'year']
//       },
//       everyXPeriods: { type: Number, required: true },
//       notification: { type: Boolean, required: false, }
//     }
//   ]

// } as const;
// export const TaskSchema = new Schema(schemaDefinition, { timestamps: true });
// TaskSchema.set('toJSON', {
//   virtuals: true,
// });
// export const TaskOLD = model('Task', TaskSchema);
// export type TTaskRaw = InferRawDocType<typeof schemaDefinition>;
// export type TTask = HydratedDocument<TTaskRaw>;
