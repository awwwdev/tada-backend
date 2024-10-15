// const Product = require("../schema/product.model");
import { eq } from 'drizzle-orm';
import { FOLDER, folderCreateSchema, folderUpdateSchema } from '../schema/folder.model';
import getDBClient from '../db/client';
import { createProtectedHandler } from '../utils/createHandler';
import { z } from 'zod';
import { singleOrThrow } from '../db/utils';
import { defineAbilitiesFor } from '../access-control/user.access';
import { subject } from '@casl/ability';
import { BackendError } from '../utils/errors';

const db = getDBClient();

export const getFolders = createProtectedHandler(
  z.object({}),
  () => true,
  async (req, res) => {
    // const filterOptions = req.query.userId ? { author: req.query.userId } : {};
    // @ts-ignore
    const folders = await db.select().from(FOLDER);
    // .find({author: req?.user?._id}).populate('author').populate('lists');
    res.status(200).json(folders);
  }
);

export const getFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }) }),
  (ability, req) => ability.can('read', subject('FOLDER', req.body)),
  async (req, res) => {
    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('create', subject('FOLDER', req.body));
    if (!hasAccess) throw Error('Unauthorized');

    const { id } = req.params;
    const folder = await db.select().from(FOLDER).where(eq(FOLDER.id, id)).then(singleOrThrow);
    // FOLDER.findById(id).populate('author').populate('lists');
    res.status(200).json(folder);
  }
);

export const createFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }), body: folderCreateSchema }),
  (ability, req) => ability.can('create', subject('FOLDER', req.body)),
  async (req, res) => {
    const folder = await db.insert(FOLDER).values(req.body).returning().then(singleOrThrow);
    res.status(200).json(folder);
  }
);

export const updateFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }), body: folderUpdateSchema }),
  async (ability, req) => {
    const { id } = req.params;
    const currentFolder = await db.select().from(FOLDER).where(eq(FOLDER.id, id)).then(singleOrThrow);
    return ability.can('update', subject('FOLDER', { ...req.body, id: currentFolder.id }));
  },
  async (req, res) => {
    const { id } = req.params;
    const folder = await db.update(FOLDER).set(req.body).where(eq(FOLDER.id, id)).returning().then(singleOrThrow);

    if (!folder) throw new BackendError('NOT_FOUND', { message: 'FOLDER not found.' })

    res.status(200).json(folder);
  }
);

export const deleteFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }), body: folderCreateSchema }),
  async (ability, req) => {
    const { id } = req.params;
    const currentFolder = await db.select().from(FOLDER).where(eq(FOLDER.id, id)).then(singleOrThrow);
    return ability.can('delete', subject('FOLDER', { ...req.body, id: currentFolder.id }));
  },
  async (req, res) => {
    const { id } = req.params;

    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('delete', subject('FOLDER', req.body));
    if (!hasAccess) throw Error('Unauthorized');

    const folder = await db.delete(FOLDER).where(eq(FOLDER.id, id)).returning().then(singleOrThrow);

    if (!folder) throw new BackendError('NOT_FOUND', { message: 'FOLDER not found.' })

    res.status(200).json({ message: 'FOLDER deleted successfully' });
  }
);
