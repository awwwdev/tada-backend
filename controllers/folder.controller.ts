// const Product = require("../models/product.model");
import { eq } from 'drizzle-orm';
import { Folder, folderCreateSchema, folderUpdateSchema } from '../models/folder.model';
import getDBClient from '../db/client';
import { createProtectedHandler } from '@/utils/createHandler';
import { z } from 'zod';

const db = getDBClient();

export const getFolders = createProtectedHandler(
  z.object({}),
  async (req, res) => {
    try {
      // const filterOptions = req.query.userId ? { author: req.query.userId } : {};
      // @ts-ignore
      const folders = await db.select().from(Folder);
      // .find({author: req?.user?._id}).populate('author').populate('lists');
      res.status(200).json(folders);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
    }
  });

export const getFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }) }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const [folder] = await db.select().from(Folder).where(eq(Folder.id, id));
      // Folder.findById(id).populate('author').populate('lists');
      res.status(200).json(folder);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
    }
  }
);

export const createFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }), body: folderCreateSchema }),
  async (req, res) => {
    try {
      const [folder] = await db.insert(Folder).values(req.body).returning();
      res.status(200).json(folder);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
    }
  }
);

export const updateFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }), body: folderUpdateSchema }),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [folder] = await db.update(Folder).set(req.body).where(eq(Folder.id, id)).returning();

      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }

      // const updatedFolder = await Folder.findById(id).populate('author').populate('lists');
      res.status(200).json(folder);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
    }
  }
);

export const deleteFolder = createProtectedHandler(
  z.object({ params: z.object({ id: z.string() }) }),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [folder] = await db.delete(Folder).where(eq(Folder.id, id)).returning();

      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }
      res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
    }
  }
);
