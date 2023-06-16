import { Request, Response, NextFunction, RequestHandler } from 'express';

type MiddlewareWrapperType = (
  fn1: (req: Request, res: Response, next: NextFunction) => void,
  fn2: (req: Request, res: Response, next: NextFunction) => void,
) => RequestHandler;

const checkMessageType: MiddlewareWrapperType = (fn1, fn2) => async (req, res, next) => {
  (req.params.serverId) ? fn1(req, res, next) : fn2(req, res, next);
}

export default checkMessageType;