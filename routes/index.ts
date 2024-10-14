import listRouter from '../routes/list.route';
import taskRouter from '../routes/task.route';
import folderRouter from '../routes/folder.route';
import authRouter from '../routes/auth.route';
import settingsRouter from './settingsRouter';
import { createRouter } from '@/utils/createRouter';


export default createRouter((router) => {
  router.use('/auth/', authRouter);
  router.use('/folders', folderRouter);
  router.use('/lists', listRouter);
  router.use('/tasks', taskRouter);
  router.use('/settings', settingsRouter);
});