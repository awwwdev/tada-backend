// const Product = require("../models/product.model");
import { eq } from 'drizzle-orm';
import { List, ListValidationSchemas } from "../models/list.model";
import type { Request, Response } from 'express';
import getDBClient from '../db/client';
import { UserSelect } from '@/models/user.model';
import { subject } from '@casl/ability';
import { createProtectedHandler } from '@/utils/createHandler';
import { defineAbilitiesFor } from '@/access-control/user.access';

const db = getDBClient();

export const getLists = createProtectedHandler(async (req, res) => {
  try {
    // @ts-ignore
    const lists = await db.select().from(List)
    //  List.find({ author: req?.user?._id }).populate('author').populate('tasks');;
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
});

export const getList = createProtectedHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const [list] = await db.select().from(List).where(eq(List.id, id));
    // List.findById(id).populate('author').populate('tasks.task');
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
});

export const createList = createProtectedHandler(ListValidationSchemas.create, async (req, res) => {
  try {

    const ability = defineAbilitiesFor(req.user)
    const hasAccess = ability.can('create', subject('List', req.body))
    if (!hasAccess) throw Error('Unauthorized');

    const [list] = await db.insert(List).values(req.body).returning();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
});

export const updateList = async (req: Request, res: Response) => {
  try {
    const ability = defineAbilitiesFor(req.user as UserSelect)
    const hasAccess = ability.can('update', subject('List', req.body));
    if (!hasAccess) throw Error('Unauthorized');
    const { id } = req.params;
    const x = ListSchemas.update.parse(req.body);
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
