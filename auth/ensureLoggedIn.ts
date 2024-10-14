import { RequestHandler } from 'express';
import { BackendError } from '@/utils/errors';

const ensureLoggedIn: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  throw new BackendError('NOT_AUTHENTICATED', { message: 'Not authenticated.' });
}
export default ensureLoggedIn;
