import {Pool} from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
    console.log('Using test environment');
    dotenv.config({path: '.env.test'});
} else {
    console.log('Using ', process.env.NODE_ENV, ' environment');

    dotenv.config();
}

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});
