// const Product = require("../models/product.model");
import { Folder } from '../models/folder.model';
import type { Request, Response } from 'express';

export const getFolders = async (req: Request, res: Response) => {
  try {
    // const filterOptions = req.query.userId ? { author: req.query.userId } : {};
    // @ts-ignore
    const folders = await Folder.find({author: req?.user?._id}).populate('author').populate('lists');
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
};

export const getFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findById(id).populate('author').populate('lists');
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
};

export const createFolder = async (req: Request, res: Response) => {
  try {
    const folder = await Folder.create(req.body);
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
};

export const updateFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findByIdAndUpdate(id, req.body);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const updatedFolder = await Folder.findById(id).populate('author').populate('lists');
    res.status(200).json(updatedFolder);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findByIdAndDelete(id);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
};
