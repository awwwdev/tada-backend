// const Product = require("../models/product.model");
import { and, asc, eq } from 'drizzle-orm';
import { Task, taskCreateSchema, taskUpdateSchema } from '../models/task.model';
import getDBClient from '../db/client';

import { createProtectedHandler } from '@/utils/createHandler';
import { z } from 'zod';
import { singleOrThrow } from '@/db/utils';
import { subject } from '@casl/ability';
import { defineAbilitiesFor } from '@/access-control/user.access';

const db = getDBClient();

export const getTasks = createProtectedHandler(
  z.object({}),
  () => true,
  async (req, res) => {
    const userId = req?.user?.id ?? '';
    const listId = req.query.listId as string;

    const tasks = await db
      .select()
      .from(Task)
      .where(and(eq(Task.authorId, userId), listId ? eq(Task.listId, listId) : undefined))
      .orderBy(asc(Task.createdAt));
    res.status(200).json(tasks);
  }
);

export const getTask = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }) }),
  (ability, req) => ability.can('read', subject('Task', req.body)),
  async (req, res) => {
    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('read', subject('Task', req.body));
    if (!hasAccess) throw Error('Unauthorized');

    const { id } = req.params;
    const task = await db.select().from(Task).where(eq(Task.id, id)).then(singleOrThrow);
    res.status(200).json(task);
  }
);

export const createTask = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }), body: taskCreateSchema }),
  (ability, req) => ability.can('create', subject('Task', req.body)),
  async (req, res) => {
    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('create', subject('Task', req.body));
    if (!hasAccess) throw Error('Unauthorized');

    const task = await db.insert(Task).values(req.body).returning().then(singleOrThrow);
    res.status(200).json(task);
  }
);

export const updateTask = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }), body: taskUpdateSchema }),
  async (ability, req) => {
    const { id } = req.params;
    const currentTask = await db.select().from(Task).where(eq(Task.id, id)).then(singleOrThrow);
    return ability.can('update', subject('Task', { ...req.body, id: currentTask.id }));
  },
  async (req, res) => {
    const { id } = req.params;
    const currentTask = await db.select().from(Task).where(eq(Task.id, id)).then(singleOrThrow);

    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('update', subject('Task', { ...req.body, authorId: currentTask.authorId }));
    if (!hasAccess) throw Error('Unauthorized');

    const task = await db.update(Task).set(req.body).where(eq(Task.id, id)).returning().then(singleOrThrow);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  }
);

export const deleteTask = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }) }),
  async (ability, req) => {
    const { id } = req.params;
    const currentTask = await db.select().from(Task).where(eq(Task.id, id)).then(singleOrThrow);
    return ability.can('delete', subject('Task', { ...req.body, id: currentTask.id }));
  },
  async (req, res) => {
    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('delete', subject('Task', req.body));
    if (!hasAccess) throw Error('Unauthorized');

    const { id } = req.params;

    const task = await db.delete(Task).where(eq(Task.id, id)).returning().then(singleOrThrow);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  }
);
