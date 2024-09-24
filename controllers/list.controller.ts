// const Product = require("../models/product.model");
import { List } from "../models/list.model";
import type {  Request, Response  } from 'express';


export const getLists = async (req: Request, res: Response) => {
  try {
    const lists = await List.find({}).populate('author').populate('tasks');;
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const getList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const list = await List.findById(id).populate('author').populate('lists');;
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const createList = async (req: Request, res: Response) => {
  try {
    const list = await List.create(req.body);
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const updateList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const list = await List.findByIdAndUpdate(id, req.body);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const updatedList = await List.findById(id).populate('author').populate('lists');;
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const deleteList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const list = await List.findByIdAndDelete(id);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};
