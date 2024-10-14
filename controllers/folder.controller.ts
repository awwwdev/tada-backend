// const Product = require("../models/product.model");
import { eq } from 'drizzle-orm';
import { Folder, folderCreateSchema, folderUpdateSchema } from '../models/folder.model';
import getDBClient from '../db/client';
import { createProtectedHandler } from '@/utils/createHandler';
import { z } from 'zod';
import { singleOrThrow } from '@/db/utils';
import { defineAbilitiesFor } from '@/access-control/user.access';
import { subject } from '@casl/ability';

const db = getDBClient();

export const getFolders = createProtectedHandler(
  z.object({}),
  () => true,
  async (req, res) => {
    // const filterOptions = req.query.userId ? { author: req.query.userId } : {};
    // @ts-ignore
    const folders = await db.select().from(Folder);
    // .find({author: req?.user?._id}).populate('author').populate('lists');
    res.status(200).json(folders);
  }
);

export const getFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }) }),
  (ability, req) => ability.can('read', subject('Folder', req.body)),
  async (req, res) => {
    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('create', subject('Folder', req.body));
    if (!hasAccess) throw Error('Unauthorized');

    const { id } = req.params;
    const folder = await db.select().from(Folder).where(eq(Folder.id, id)).then(singleOrThrow);
    // Folder.findById(id).populate('author').populate('lists');
    res.status(200).json(folder);
  }
);

export const createFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }), body: folderCreateSchema }),
  (ability, req) => ability.can('create', subject('Folder', req.body)),
  async (req, res) => {
    const folder = await db.insert(Folder).values(req.body).returning().then(singleOrThrow);
    res.status(200).json(folder);
  }
);

export const updateFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }), body: folderUpdateSchema }),
  async (ability, req) => {
    const { id } = req.params;
    const currentFolder = await db.select().from(Folder).where(eq(Folder.id, id)).then(singleOrThrow);
    return ability.can('update', subject('Folder', { ...req.body, id: currentFolder.id }));
  },
  async (req, res) => {
    const { id } = req.params;
    const folder = await db.update(Folder).set(req.body).where(eq(Folder.id, id)).returning().then(singleOrThrow);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // const updatedFolder = await Folder.findById(id).populate('author').populate('lists');
    res.status(200).json(folder);
  }
);

export const deleteFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }), body: folderCreateSchema }),
  async (ability, req) => {
    const { id } = req.params;
    const currentFolder = await db.select().from(Folder).where(eq(Folder.id, id)).then(singleOrThrow);
    return ability.can('delete', subject('Folder', { ...req.body, id: currentFolder.id }));
  },
  async (req, res) => {
    const { id } = req.params;

    const ability = defineAbilitiesFor(req.user);
    const hasAccess = ability.can('delete', subject('Folder', req.body));
    if (!hasAccess) throw Error('Unauthorized');

    const folder = await db.delete(Folder).where(eq(Folder.id, id)).returning().then(singleOrThrow);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.status(200).json({ message: 'Folder deleted successfully' });
  }
);
