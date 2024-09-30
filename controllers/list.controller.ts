// const Product = require("../models/product.model");
import { eq } from 'drizzle-orm';
import { List } from "../models/list.model";
import type { Request, Response } from 'express';
import getDBClient from '../db/client';

const db = getDBClient();

export const getLists = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const lists = await db.select().from(List)
    //  List.find({ author: req?.user?._id }).populate('author').populate('tasks');;
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const getList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [list] = await db.select().from(List).where(eq(List.id, id));
    // List.findById(id).populate('author').populate('tasks.task');
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const createList = async (req: Request, res: Response) => {
  try {
    const [list] = await db.insert(List).values(req.body).returning();
    //  List.create(req.body);
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const updateList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [list] = await db.update(List).set(req.body).where(eq(List.id, id)).returning();
    // List.findByIdAndUpdate(id, req.body);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // const updatedList = await List.findById(id).populate('author').populate('tasks.id');
    console.log("🚀 ~ updatedList:", list)
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const deleteList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [list] = await db.delete(List).where(eq(List.id, id)).returning();
    // List.findByIdAndDelete(id);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};
