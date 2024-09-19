import { Request, Response } from 'express';
import ERRORS from '../errors';

export default function ensureLoggedIn(req: Request, res: Response, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json(ERRORS.NOT_AUTHENTICATED);
}
