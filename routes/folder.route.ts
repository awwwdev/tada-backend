import express, { Express, Request, Response , Application } from 'express';
import { Folder } from '../models/folder.model';
import { getFolders, getFolder, createFolder, updateFolder, deleteFolder } from '../controllers/folder.controller';
import connectEnsureLogIn from 'connect-ensure-login';
var ensureLogIn = connectEnsureLogIn.ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();
const folderRouter = express.Router();

const checkAuthenticated = (req: Request, res: Response, next: any) => {  
  if (req.isAuthenticated()) { return next() }
  res.status(401).json({ message: 'Not Authenticated' });
}


folderRouter.get('/',  checkAuthenticated, getFolders);
folderRouter.get("/:id", getFolder);
folderRouter.post("/", ensureLogIn,  createFolder);

// update a Folder
folderRouter.put("/:id", updateFolder);

// delete a Folder
folderRouter.delete("/:id", deleteFolder);


export default folderRouter;

