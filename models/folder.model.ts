import { Schema , model } from 'mongoose';
// Schema
export const FolderScehma = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String
});

export const Folder = model("Product", FolderScehma);