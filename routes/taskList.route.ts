import express from 'express';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/task.controller';
import ensureLoggedIn from '../auth/ensureLoggedIn';
const taskRouter = express.Router();

taskRouter.get('/', ensureLoggedIn, getTasks);
taskRouter.get('/:id', ensureLoggedIn, getTask);
taskRouter.post('/', ensureLoggedIn, createTask);

// update a Task
taskRouter.patch('/:id', ensureLoggedIn, updateTask);

// delete a Task
taskRouter.delete('/:id', ensureLoggedIn, deleteTask);

export default taskRouter;
