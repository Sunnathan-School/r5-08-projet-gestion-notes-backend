/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - credits
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-généré du cours
 *         code:
 *           type: string
 *           description: Code unique du cours
 *         name:
 *           type: string
 *           description: Nom du cours
 *         credits:
 *           type: integer
 *           description: Nombre de crédits ECTS
 *         description:
 *           type: string
 *           description: Description détaillée du cours
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Récupère la liste des cours
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des cours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: Non authentifié
 *
 *   post:
 *     summary: Crée un nouveau cours
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Cours créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *
 * /courses/{id}:
 *   put:
 *     summary: Met à jour un cours
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Cours mis à jour
 *       404:
 *         description: Cours non trouvé
 *
 *   delete:
 *     summary: Supprime un cours
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cours supprimé
 *       404:
 *         description: Cours non trouvé
 */

import { Router } from 'express';
import { courseController } from '../controllers/courseController';
import { validate } from '../middleware/validate';
import { createCourseSchema } from '../schemas/course.schema';

const router = Router();

router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);
router.post('/', validate(createCourseSchema), courseController.create);
router.put('/:id', validate(createCourseSchema), courseController.update);
router.delete('/:id', courseController.delete);

export const courseRoutes = router;
