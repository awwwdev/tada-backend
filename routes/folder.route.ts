import express from 'express';
import { getFolders, getFolder, createFolder, updateFolder, deleteFolder } from '../controllers/folder.controller';
import ensureLoggedIn from '../auth/ensureLoggedIn';
const folderRouter = express.Router();

folderRouter.get('/', ensureLoggedIn, getFolders);
folderRouter.get('/:id', ensureLoggedIn, getFolder);
folderRouter.post('/', ensureLoggedIn, createFolder);

// update a Folder
folderRouter.put('/:id', ensureLoggedIn, updateFolder);

// delete a Folder
folderRouter.delete('/:id', ensureLoggedIn, deleteFolder);

export default folderRouter;
