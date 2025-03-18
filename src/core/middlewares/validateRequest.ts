// src/core/middlewares/validateRequest.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = <ReqBody>(
  schema: ZodSchema<ReqBody>,
  property: 'body' | 'query' | 'params' = 'body'
): RequestHandler<object, unknown, ReqBody, unknown> => {
  return (
    req: Request<object, unknown, ReqBody, unknown>,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      // Validate the request property (body, query, or params) against the schema.
      schema.parse(req[property] as ReqBody);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Validation error',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  };
};
