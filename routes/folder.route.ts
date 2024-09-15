import express, { Express, Request, Response , Application } from 'express';
import { Folder } from '../models/folder.model';
import { getFolders, getFolder, createFolder, updateFolder, deleteFolder } from '../controllers/folder.controller';
const folderRouter = express.Router();



folderRouter.get('/', getFolders);
folderRouter.get("/:id", getFolder);

folderRouter.post("/", createFolder);

// update a Folder
folderRouter.put("/:id", updateFolder);

// delete a Folder
folderRouter.delete("/:id", deleteFolder);


export default folderRouter;

