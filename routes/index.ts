import listRouter from './list.route';
import taskRouter from './task.route';
import folderRouter from './folder.route';
import authRouter from './auth.route';
import settingsRouter from './settingsRouter';
import { createRouter } from '../utils/createRouter';


export default createRouter((router) => {
  router.use('/auth/', authRouter);
  router.use('/folders', folderRouter);
  router.use('/lists', listRouter);
  router.use('/tasks', taskRouter);
  router.use('/settings', settingsRouter);
});