import { integer, pgTable, serial, text , boolean, uuid, pgEnum  ,timestamp} from 'drizzle-orm/pg-core';
import { TASK } from './task.model';
import { LIST } from './list.model';



export const TaskList = pgTable('task_list', {
	id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  taskId: uuid('task_id').references(() => TASK.id),
  listId: uuid('list_id').references(() => LIST.id),
  show: boolean('show'),
  orderInLisnt: integer('order_in_panel'),
});


export type TaskListInsert = typeof TaskList.$inferInsert;
export type TaskListSelect = typeof TaskList.$inferSelect;