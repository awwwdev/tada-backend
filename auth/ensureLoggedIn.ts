import { Request, Response } from 'express';

export default function ensureLoggedIn(req: Request, res: Response, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Not Authenticated' });
}
