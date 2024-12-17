/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email du professeur
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe du professeur
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token
 *         professor:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             email:
 *               type: string
 *             firstName:
 *               type: string
 *             department:
 *               type: string
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentification d'un professeur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Authentification échouée
 *       500:
 *         description: Erreur serveur
 */

import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);

export const authRoutes = router;
