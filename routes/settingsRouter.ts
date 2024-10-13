import express from 'express';
import ensureLoggedIn from '../auth/ensureLoggedIn';
import { updateSettings } from '../controllers/user.controller';
const settingsrouter = express.Router();


settingsrouter.put('/:id', ensureLoggedIn, updateSettings);



export default settingsrouter;
