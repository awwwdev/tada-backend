// const Product = require("../models/product.model");
import { eq } from 'drizzle-orm';
import { User, userUpdateSchema } from '../models/user.model';
import getDBClient from '../db/client';
import { createProtectedHandler } from '@/utils/createHandler';
import { z } from 'zod';
import { singleOrThrow } from '@/db/utils';
import { BackendError } from '@/utils/errors';

const db = getDBClient();

export const getUser = createProtectedHandler(
  z.object({}),
  (ability, req) => req.user.id === req.params.id,
  async (req, res) => {
    const { id } = req.params;
    const user = await db.select().from(User).where(eq(User.id, id)).then(singleOrThrow);

    res.status(200).json(user);
  }
);

export const updateUser = createProtectedHandler(
  z.object({
    params: z.object({ id: z.string() }),
    body: userUpdateSchema,
  }),
  (ability, req) => req.user.id === req.params.id,
  async (req, res) => {
    const { id } = req.params;

    const user = await db.update(User).set(req.body).where(eq(User.id, id)).returning().then(singleOrThrow);
    // .findByIdAndUpdate(id, req.body);

    if (!user) throw new BackendError('NOT_FOUND', { message: 'User not found.' });

    // const updatedUser = await User.findById(id).populate('folders');
    res.status(200).json(user);
  }
);

export const updateSettings = createProtectedHandler(
  z.object({
    params: z.object({ id: z.string() }),
    body: userUpdateSchema.shape.settings,
  }),
  (ability, req) => req.user.id === req.params.id,
  async (req, res) => {
    const { id } = req.params;

    const user = await db
      .update(User)
      .set({ settings: req.body })
      .where(eq(User.id, id))
      .returning()
      .then(singleOrThrow);

    if (!user) throw new BackendError('NOT_FOUND', { message: 'User not found.' });

    res.status(200).json(user);
  }
);

export const deleteUser = createProtectedHandler(
  z.object({
    params: z.object({ id: z.string() }),
  }),
  (ability, req) => req.user.id === req.params.id,
  async (req, res) => {
    const { id } = req.params;

    const user = await db.delete(User).where(eq(User.id, id)).returning().then(singleOrThrow);

    if (!user) throw new BackendError('NOT_FOUND', { message: 'User not found.' });

    res.status(200).json({ message: 'User deleted successfully' });
  }
);
