/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - dateOfBirth
 *         - studentId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-généré de l'étudiant
 *         firstName:
 *           type: string
 *           description: Prénom de l'étudiant
 *         lastName:
 *           type: string
 *           description: Nom de l'étudiant
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'étudiant
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date de naissance de l'étudiant
 *         studentId:
 *           type: string
 *           description: Numéro d'étudiant unique
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Récupère la liste des étudiants
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des étudiants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 *
 *   post:
 *     summary: Crée un nouvel étudiant
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Étudiant créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */

import { Router } from 'express';
import { studentController } from '../controllers/studentController';
import { validate } from '../middleware/validate';
import { createStudentSchema } from '../schemas/student.schema';

const router = Router();

router.get('/', studentController.getAll);
router.get('/:id', studentController.getById);
router.post('/', validate(createStudentSchema), studentController.create);

export const studentRoutes = router;
