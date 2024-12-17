import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ErrorResponse } from '../types/error';
import { logger } from '../services/loggerService';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error('Error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Données invalides',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
    return;
  }

  // Gestion des erreurs de PostgreSQL
  if (err.name === 'QueryResultError') {
    res.status(404).json({
      error: {
        message: 'Ressource non trouvée',
        code: 'NOT_FOUND',
      },
    });
    return;
  }

  // Erreur par défaut
  res.status(500).json({
    error: {
      message: 'Erreur interne du serveur',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};
