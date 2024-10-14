import { UserSelect } from '@/models/user.model';
import { type NextFunction, type Request, RequestHandler, type Response } from 'express';
import type { z } from 'zod';

export type ProtectedHandler = (
  req: Omit<Request, 'user'> & { user: UserSelect },
  res: Response,
  next?: NextFunction
) => ReturnType<RequestHandler>;

type ValidatedHandler<T extends z.ZodType> = (
  req: Omit<Request, keyof z.output<T>> & z.output<T>,
  res: Response,
  next?: NextFunction
) => ReturnType<RequestHandler>;

type ValidatedProtectedHandler<T extends z.ZodType> = (
  req: Omit<Request, keyof z.output<T> | 'user'> & z.output<T> & { user: UserSelect },
  res: Response,
  next?: NextFunction
) => ReturnType<RequestHandler>;

export function createHandler<T extends z.ZodType>(schema: T, handler: ValidatedHandler<T>): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}


export function createProtectedHandler<T extends z.ZodType>(
  schema: T,
  handler: ValidatedProtectedHandler<T>
): ProtectedHandler {
  return createHandler<T>(schema as T, handler) as ProtectedHandler;
}
