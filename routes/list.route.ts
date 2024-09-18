import express from 'express';
import { getLists, getList, createList, updateList, deleteList } from '../controllers/list.controller';
import ensureLoggedIn from '../auth/ensureLoggedIn';
const listRouter  = express.Router();

listRouter.get('/', ensureLoggedIn, getLists);
listRouter.get('/:id', ensureLoggedIn, getList);
listRouter.post('/', ensureLoggedIn, createList);

// update a List
listRouter.put('/:id', ensureLoggedIn, updateList);

// delete a List
listRouter.delete('/:id', ensureLoggedIn, deleteList);

export default listRouter;
