import { logger } from '../services/loggerService';

export const setupUnhandledErrors = (): void => {
  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Rejection', { reason });
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', { error });
    process.exit(1);
  });
};
