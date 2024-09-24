import express from 'express';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/task.controller';
import ensureLoggedIn from '../auth/ensureLoggedIn';
import { updateSettings } from '../controllers/user.controller';
const settingsRouter  = express.Router();


// update a Task
settingsRouter.put('/:id', ensureLoggedIn, updateSettings);

export default settingsRouter;
