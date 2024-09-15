// const Product = require("../models/product.model");
import { Folder } from "../models/folder.model";
import type {  Request, Response  } from 'express';


export const getFolders = async (req: Request, res: Response) => {
  try {
    const folders = await Folder.find({});
    res.status(200).json(folders);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findById(id);
    res.status(200).json(Folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFolder = async (req: Request, res: Response) => {
  try {
    const folder = await Folder.create(req.body);
    res.status(200).json(Folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findByIdAndUpdate(id, req.body);

    if (!Folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const updatedFolder = await Folder.findById(id);
    res.status(200).json(updatedFolder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findByIdAndDelete(id);

    if (!Folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
