import { Request, Response, NextFunction, RequestHandler } from 'express';

type MiddlewareWrapperType = (
  fn: (req: Request, res: Response, next?: NextFunction) => void
) => RequestHandler;

const tryCatch: MiddlewareWrapperType = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    return next(err);
  }
}

export default tryCatch;