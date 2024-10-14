import { ensureLoggedIn } from 'connect-ensure-login';
import {  Router } from 'express';
import { ProtectedHandler } from './createHandler';


type ProtectedRouter = {
  get: (path: string, protectedHandler: ProtectedHandler) => void;
  put: (path: string, protectedHandler: ProtectedHandler) => void;
  post: (path: string, protectedHandler: ProtectedHandler) => void;
  patch: (path: string, protectedHandler: ProtectedHandler) => void;
  delete: (path: string, protectedHandler: ProtectedHandler) => void;
}

export function createRouter(callback: (router: Router, protectedRouter: ProtectedRouter) => void) {
  const router = Router();

  const protectedRouter = {
    get: (path: string, protectedHandler: ProtectedHandler) =>
      // @ts-ignore
      router.get(path, ensureLoggedIn, protectedHandler),
    put: (path: string, protectedHandler: ProtectedHandler) =>
      // @ts-ignore
      router.put(path, ensureLoggedIn, protectedHandler),
    post: (path: string, protectedHandler: ProtectedHandler) =>
      // @ts-ignore
      router.post(path, ensureLoggedIn, protectedHandler),
    patch: (path: string, protectedHandler: ProtectedHandler) =>
      // @ts-ignore
      router.patch(path, ensureLoggedIn, protectedHandler),
    delete: (path: string, protectedHandler: ProtectedHandler) =>
      // @ts-ignore
      router.delete(path, ensureLoggedIn, protectedHandler),
  };

  callback(router, protectedRouter);
  return router;
}
