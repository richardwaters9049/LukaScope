import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Validation error response
 */
export const validationError = (res: Response, errors: Record<string, string[]>): void => {
  res.status(400).json({
    error: 'Validation Error',
    details: errors,
  });
};

/**
 * Generic validation middleware factory
 */
export const validate = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate request body
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format Zod errors
        const errors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.') || 'general';
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });
        validationError(res, errors);
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};