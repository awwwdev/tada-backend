// const Product = require("../schema/product.model");
import { eq } from 'drizzle-orm';
import { LIST, listCreateSchema, listUpdateSchema } from '../schema/list.model';
import getDBClient from '../db/client';
import { subject } from '@casl/ability';
import { createProtectedHandler } from '../utils/createHandler';
import { defineAbilitiesFor } from '../access-control/user.access';
import { z } from 'zod';
import { singleOrThrow } from '../db/utils';
import { BackendError } from '../utils/errors';

const db = getDBClient();

export const getLists = createProtectedHandler(
  z.object({}),
  () => true,
  async (req, res) => {
    // @ts-ignore
    const lists = await db.select().from(List);
    //  List.find({ author: req?.user?._id }).populate('author').populate('tasks');;
    res.status(200).json(lists);
  }
);

export const getList = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }) }),
  (ability, req) => ability.can('read', subject('List', req.body)),
  async (req, res) => {
    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('read', subject('List', req.body));
    if (!hasAccess) throw Error('Unauthorized');

    const { id } = req.params;
    const list = await db.select().from(LIST).where(eq(LIST.id, id)).then(singleOrThrow);
    // List.findById(id).populate('author').populate('tasks.task');
    res.status(200).json(list);
  }
);

export const createList = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }), body: listCreateSchema }),
  (ability, req) => ability.can('create', subject('List', req.body)),
  async (req, res) => {
    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('create', subject('List', req.body));
    if (!hasAccess) throw Error('Unauthorized');

    const list = await db.insert(LIST).values(req.body).returning().then(singleOrThrow);
    res.status(200).json(list);
  }
);

export const updateList = createProtectedHandler(
  z.object({ body: listUpdateSchema, params: z.object({ id: z.string() }) }),
  async (ability, req) => {
    const { id } = req.params;
    const currentList = await db.select().from(LIST).where(eq(LIST.id, id)).then(singleOrThrow);
    return ability.can('update', subject('List', { ...req.body, id: currentList.id }));
  },
  async (req, res) => {
    const { id } = req.params;
    const currentList = await db.select().from(LIST).where(eq(LIST.id, id)).then(singleOrThrow);

    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('update', subject('List', { ...req.body, authorId: currentList.authorId }));
    if (!hasAccess) throw Error('Unauthorized');

    const list = await db.update(LIST).set(req.body).where(eq(LIST.id, id)).returning().then(singleOrThrow);
    // List.findByIdAndUpdate(id, req.body);

    if (!list) throw new BackendError('NOT_FOUND', { message: 'List not found.' })

    // const updatedList = await List.findById(id).populate('author').populate('tasks.id');
    res.status(200).json(list);
  }
);

export const deleteList = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }) }),

  async (ability, req) => {
    const { id } = req.params;
    const currentList = await db.select().from(LIST).where(eq(LIST.id, id)).then(singleOrThrow);
    return ability.can('delete', subject('List', { ...req.body, id: currentList.id }));
  },
  async (req, res) => {
    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('delete', subject('List', req.body));
    if (!hasAccess) throw Error('Unauthorized');

    const { id } = req.params;

    const list = await db.delete(LIST).where(eq(LIST.id, id)).returning().then(singleOrThrow);
    // List.findByIdAndDelete(id);

    if (!list) throw new BackendError('NOT_FOUND', { message: 'List not found.' })

    res.status(200).json({ message: 'List deleted successfully' });
  }
);
