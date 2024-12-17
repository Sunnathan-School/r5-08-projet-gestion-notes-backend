import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';
import { logger } from '../services/loggerService';

async function isDatabaseInitialized(): Promise<boolean> {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'professors'
      );
    `);
    return result.rows[0].exists;
  } catch (error) {
    return false;
  }
}

async function setupDatabase() {
  try {
    // Vérifier si la base est déjà initialisée
    const isInitialized = await isDatabaseInitialized();
    if (isInitialized) {
      logger.info('Database already initialized, skipping setup');
      return;
    }

    // Lire et exécuter les scripts SQL
    const initSQL = fs.readFileSync(
      path.join(__dirname, '../../db/init.sql'),
      'utf8'
    );
    const seedSQL = fs.readFileSync(
      path.join(__dirname, '../../db/seed.sql'),
      'utf8'
    );

    await pool.query(initSQL);
    await pool.query(seedSQL);

    logger.info('Database setup completed successfully');
  } catch (error) {
    logger.error('Database setup failed:', error);
    throw error;
  }
}

if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { setupDatabase };
