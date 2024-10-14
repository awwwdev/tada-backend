
import { getLists, getList, createList, updateList, deleteList } from '../controllers/list.controller';
import { createRouter } from '@/utils/createRouter';

export default createRouter((router, protectedRouter) => {

  protectedRouter.get('/', getLists);
  protectedRouter.get('/:id', getList);
  protectedRouter.post('/', createList);

  // update a List
  protectedRouter.patch('/:id', updateList);

  // delete a List
  protectedRouter.delete('/:id', deleteList);
});



