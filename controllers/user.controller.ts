// const Product = require("../models/product.model");
import { eq } from 'drizzle-orm';
import { User } from '../models/user.model';
import getDBClient from '../db/client';
import { createProtectedHandler } from '@/utils/createHandler';

const db = getDBClient();

// export const getUsers = async (req , res) => {
//   try {
//     const users = await db.select().from(User)
//   } catch (error) {
//     res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error: " + error });
//   }
// };

export const getUser = createProtectedHandler(async (req , res) => {
  try {
    const { id } = req.params;
    const [user] = await db.select().from(User).where(eq(User.id, id)); //TODO signle or throw error
    //  User.findById(id).populate('folders');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
});

export const createUser = createProtectedHandler(async (req , res) => {
  try {
    const [user] = await db.insert(User).values(req.body).returning();

    // User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
});

export const updateUser = createProtectedHandler(async (req , res) => {
  try {
    const { id } = req.params;

    const [user] = await db.update(User).set(req.body).where(eq(User.id, id)).returning();
    // .findByIdAndUpdate(id, req.body);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // const updatedUser = await User.findById(id).populate('folders');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
});

export const updateSettings = createProtectedHandler(async (req , res) => {
  try {
    const { id } = req.params;

    const [user] = await db.update(User).set({ settings: req.body }).where(eq(User.id, id)).returning();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
});

export const deleteUser = createProtectedHandler(async (req , res) => {
  try {
    const { id } = req.params;

    const [user] = await db.delete(User).where(eq(User.id, id)).returning();
    //  User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error: ' + error });
  }
});
