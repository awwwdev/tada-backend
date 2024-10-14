// const Product = require("../models/product.model");
import { and, asc, eq } from 'drizzle-orm';
import { Task, taskCreateSchema, taskUpdateSchema } from '../models/task.model';
import getDBClient from '../db/client';

import { createProtectedHandler } from '@/utils/createHandler';
import { z } from 'zod';
import { singleOrThrow } from '@/db/utils';


const db = getDBClient();


export const getTasks = createProtectedHandler(
  z.object({}),
  async (req, res) => {
    try {
      const userId = req?.user?.id ?? "";
      const listId = req.query.listId as string;

      const tasks = await db
        .select()
        .from(Task)
        .where(and(eq(Task.authorId, userId), listId ? eq(Task.listId, listId) : undefined))
        .orderBy(asc(Task.createdAt));
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
    }
  });

export const getTask = createProtectedHandler(z.object({ params: z.object({ id: z.string() }) }), async (req, res) => {
  try {
    const { id } = req.params;
    const task = await db.select().from(Task).where(eq(Task.id, id)).then(singleOrThrow);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
});

export const createTask = createProtectedHandler(z.object({ params: z.object({ id: z.string() }), body: taskCreateSchema }), async (req, res) => {
  try {
    const task = await db.insert(Task).values(req.body).returning().then(singleOrThrow);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
});

export const updateTask = createProtectedHandler(z.object({ params: z.object({ id: z.string() }), body: taskUpdateSchema }), async (req, res) => {
  try {
    const { id } = req.params;

    const task = await db.update(Task).set(req.body).where(eq(Task.id, id)).returning().then(singleOrThrow);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
});

export const deleteTask = createProtectedHandler(z.object({ params: z.object({ id: z.string() }) }), async (req, res) => {
  try {
    const { id } = req.params;

    const task = await db.delete(Task).where(eq(Task.id, id)).returning().then(singleOrThrow);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
});
