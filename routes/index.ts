import express from 'express';
import listRouter from '../routes/list.route';
import taskRouter from '../routes/task.route';
import folderRouter from '../routes/folder.route';
import authRouter from '../routes/auth.route';
import settingsrouter from './settingsRouter';


const router = express.Router();

router.use('/auth/', authRouter);
router.use('/folders', folderRouter);
router.use('/lists', listRouter);
router.use('/tasks', taskRouter);
router.use('/settings', settingsrouter);

export default router;