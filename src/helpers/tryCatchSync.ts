import { Request, Response, NextFunction, RequestHandler } from 'express';

type MiddlewareWrapperType = (
  fn: (req: Request, res: Response, next: NextFunction) => void
) => RequestHandler;

const tryCatchSync: MiddlewareWrapperType = fn => (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (err) {
    console.log('in catch');
    return next(err);
  }
}

export default tryCatchSync;