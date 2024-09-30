// const Product = require("../models/product.model");
import { eq } from 'drizzle-orm';
import { Folder } from '../models/folder.model';
import type { Request, Response } from 'express';
import getDBClient from '../db/client';

const db = getDBClient();

export const getFolders = async (req: Request, res: Response) => {
  try {
    // const filterOptions = req.query.userId ? { author: req.query.userId } : {};
    // @ts-ignore
    const folders = await db.select().from(Folder)
    // .find({author: req?.user?._id}).populate('author').populate('lists');
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
};

export const getFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [folder] = await db.select().from(Folder).where(eq(Folder.id, id));
    // Folder.findById(id).populate('author').populate('lists');
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
};

export const createFolder = async (req: Request, res: Response) => {
  try {
    const [folder] = await db.insert(Folder).values(req.body).returning();
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
};

export const updateFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [folder] = await db.update(Folder)
    .set(req.body)
    .where(eq(Folder.id, id)).returning();

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // const updatedFolder = await Folder.findById(id).populate('author').populate('lists');
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [folder] = await db.delete(Folder)
    .where(eq(Folder.id, id)).returning();

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
};
