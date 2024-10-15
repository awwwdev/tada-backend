import { getFolders, getFolder, createFolder, updateFolder, deleteFolder } from '../controllers/folder.controller';
import { createRouter } from '../utils/createRouter';

export default createRouter((router, protectedRouter) => {
  protectedRouter.get('/', getFolders);
  protectedRouter.get('/:id', getFolder);
  protectedRouter.post('/', createFolder);

  // update a Folder
  protectedRouter.patch('/:id', updateFolder);

  // delete a Folder
  protectedRouter.delete('/:id', deleteFolder);
});



