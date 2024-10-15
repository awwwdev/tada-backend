
import { boolean, integer, pgEnum, pgTable, serial, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { USER } from './user.model';

export const WeekdaysEnum = pgEnum('start_of_week', ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);

export const Settings = pgTable('Settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  userId: uuid('user_id').references(() => USER.id),
  // startOfWeek: WeekdaysEnum('start_of_week').notNull().default('sunday'),
  showCompletedTasks: boolean('show_completed_tasks').notNull().default(true),
  theme: text('theme').notNull().default('system'),
});


export type SettingsInsert = typeof Settings.$inferInsert;
export type SettingsSelect = typeof Settings.$inferSelect;