// import mongoose, { HydratedDocument, InferRawDocType } from 'mongoose';
import { isEmail } from 'validator';


import { integer, pgTable, serial, text, uuid, customType, timestamp, json   } from 'drizzle-orm/pg-core';
// import * as x from 'drizzle-orm/

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
});

type Settings = {
  showCompletedTasks?: boolean;
  theme?: 'light' | 'dark' | 'system';
};


export const User = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
	username: text('username').unique(),
  email: text('email').unique().notNull(),
	passwordHash: bytea('password_hash').notNull(),
	salt: bytea('salt').notNull(),
  settings: json('settings').$type<Settings>().default({ theme: 'system' , showCompletedTasks: true }),

});

export type UserInsert = typeof User.$inferInsert;
export type UserSelect = typeof User.$inferSelect;

// const Schema = mongoose.Schema;

// const schemaDefinition = {
//   // username: {
//   //   type: String,
//   //   required: false,
//   //   unique: true,
//   // },
//   folders: [
//     {
//       id: { type: Schema.ObjectId, ref: 'Folder' },
//       name: { type: String, required: true },
//     },
//   ],
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     validate: {
//       validator: function (value: string) {
//         return isEmail(value);
//       },
//       message: 'Invalid email.',
//     },
//   },
//   passwordHash: {
//     type: Buffer,
//     required: true,
//     select: false,
//   },
//   salt: { type: Buffer, required: true, select: false },
//   settings: {
//     startOfWeek: {
//       type: String,
//       required: true,
//       default: 'sunday',
//       enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
//     },
//     showCompletedTasks: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     theme: {
//       type: String,
//       required: true,
//       default: 'system',
//       enum: ['light', 'dark', 'system'],
//     },
//   },
// } as const;
// const UserSchema = new Schema(schemaDefinition, { timestamps: true });
// UserSchema.set('toJSON', {
//   virtuals: true,
// });
// export const UserOLD = mongoose.model('User', UserSchema);
// export type TUserRaw = InferRawDocType<typeof schemaDefinition>;
// export type TUser = HydratedDocument<TUserRaw>;
