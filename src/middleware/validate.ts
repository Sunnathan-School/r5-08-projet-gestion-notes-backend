import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { logger } from '../services/loggerService';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const toValidate = req.method === 'GET' ? req.query : req.body;
      await schema.parseAsync(toValidate);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error('Validation error:', {
          error: error.message,
          stack: error.stack,
          path: req.path,
          method: req.method,
          ip: req.ip,
        });
        res.status(400).json({
          error: 'Données invalides',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
        return;
      }
      res.status(500).json({ error: 'Erreur de validation' });
    }
  };
