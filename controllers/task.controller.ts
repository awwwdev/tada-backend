// const Product = require("../models/product.model");
import { List } from '../models/list.model';
import { Task } from "../models/task.model";
import type { Request, Response } from 'express';


export const getTasks = async (req: Request, res: Response) => {
  try {
    // const filterOptions = req.query.userId ? { author: req.query.userId } : {};
    // @ts-ignore
    const tasks = await Task.find({ author: req.user._id }).populate('author');;
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.create(req.body);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndUpdate(id, req.body);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await Task.findById(id);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    const lists = await List.find({ "tasks.id": id });

    await Promise.all(lists.map(async (list) => {
      await List.findByIdAndUpdate(list._id, { $pull: { tasks: { id: id } } });
    }));

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
  }
};
