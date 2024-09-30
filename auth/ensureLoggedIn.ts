import { Request, Response, RequestHandler } from 'express';
import ERRORS from '../errors';
import { UserSelect } from '../models/user.model';

const  ensureLoggedIn: RequestHandler = (req, res, next ) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json(ERRORS.NOT_AUTHENTICATED);
}
export default ensureLoggedIn;

type RequestWithUser = Request & { user: UserSelect };


export function assertIsLoggedIn(req: Request): asserts req is RequestWithUser {
  if (!("user" in req)) {
      throw new Error(`Invalid request object, missing 'user'`);
  }
  if (!("cookies" in req)) {
      throw new Error(`Invalid request object, missing 'cookies'`);
  }
}