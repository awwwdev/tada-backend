import { defineAbilitiesFor } from '../access-control/user.access';
import { User } from '../schema/user.model';
import { AbilityTuple, MongoAbility, MongoQuery } from '@casl/ability';
import { type NextFunction, type Request, RequestHandler, type Response } from 'express';
import type { z } from 'zod';
import { BackendError } from './errors';

export type ProtectedHandler = (
  req: Omit<Request, 'user'> & { user: User },
  res: Response,
  next?: NextFunction
) => ReturnType<RequestHandler>;

type ValidatedHandler<T extends z.ZodType> = (
  req: Omit<Request, keyof z.output<T>> & z.output<T>,
  res: Response,
  next?: NextFunction
) => ReturnType<RequestHandler>;

type ValidatedProtectedHandler<T extends z.ZodType> = (
  req: Omit<Request, keyof z.output<T> | 'user'> & z.output<T> & { user: User },
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


type Req<T extends z.ZodType> = Omit<Request, keyof z.output<T> | 'user'> & z.output<T> & { user: User };

export function createProtectedHandler<T extends z.ZodType>(
  schema: T,
  accessController: (ability: MongoAbility<AbilityTuple, MongoQuery>, req: Req<T>) => Promise<boolean> | boolean,
  handler: ValidatedProtectedHandler<T>
): ProtectedHandler {

  return (async (req: Req<T>, res: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      const ability = defineAbilitiesFor(req.user)
      const hasAccess = await accessController(ability, req);
      if (!hasAccess) throw new BackendError('UNAUTHORIZED', {
        message: "You are not authorized to access this resource",
      });

      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  }) as ProtectedHandler;
}
