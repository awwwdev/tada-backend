import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/task.controller';
import { createRouter } from '@/utils/createRouter';

export default createRouter((router, protectedRouter) => {

protectedRouter.get('/', getTasks);
protectedRouter.get('/:id', getTask);
protectedRouter.post('/', createTask);

// update a Task
protectedRouter.patch('/:id', updateTask);

// delete a Task
protectedRouter.delete('/:id', deleteTask);
})