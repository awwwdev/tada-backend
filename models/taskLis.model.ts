import { integer, pgTable, serial, text , boolean, uuid, pgEnum  ,timestamp} from 'drizzle-orm/pg-core';
import { Task } from './task.model';
import { List } from './list.model';



export const TaskList = pgTable('task_list', {
	id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  taskId: uuid('task_id').references(() => Task.id),
  listId: uuid('list_id').references(() => List.id),
  show: boolean('show'),
  orderInLisnt: integer('order_in_panel'),
});


export type TaskListInsert = typeof TaskList.$inferInsert;
export type TaskListSelect = typeof TaskList.$inferSelect;