/**
 * @swagger
 * components:
 *   schemas:
 *     CourseStats:
 *       type: object
 *       properties:
 *         courseCode:
 *           type: string
 *           description: Code du cours
 *         courseName:
 *           type: string
 *           description: Nom du cours
 *         averageGrade:
 *           type: number
 *           description: Moyenne des notes
 *         minGrade:
 *           type: number
 *           description: Note minimale
 *         maxGrade:
 *           type: number
 *           description: Note maximale
 *         totalStudents:
 *           type: integer
 *           description: Nombre total d'étudiants
 *         successRate:
 *           type: number
 *           description: Taux de réussite en pourcentage
 *
 *     SemesterStats:
 *       type: object
 *       properties:
 *         semester:
 *           type: string
 *           enum: [S1, S2, S3, S4]
 *         averageGrade:
 *           type: number
 *           description: Moyenne du semestre
 *         totalCredits:
 *           type: integer
 *           description: Total des crédits du semestre
 *         validatedCredits:
 *           type: integer
 *           description: Crédits validés (note >= 10)
 *         coursesCount:
 *           type: integer
 *           description: Nombre de cours dans le semestre
 *
 *     GlobalStats:
 *       type: object
 *       properties:
 *         globalAverage:
 *           type: number
 *           description: Moyenne générale de tous les cours
 *         totalStudents:
 *           type: integer
 *           description: Nombre total d'étudiants
 *         totalCourses:
 *           type: integer
 *           description: Nombre total de cours
 *         averageSuccessRate:
 *           type: number
 *           description: Taux de réussite moyen en pourcentage
 */

/**
 * @swagger
 * /stats/global:
 *   get:
 *     summary: Récupère les statistiques globales
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: academicYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d{4}-\d{4}$
 *         description: Année académique (ex. 2023-2024)
 *     responses:
 *       200:
 *         description: Statistiques globales
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GlobalStats'
 *
 * /stats/course/{courseId}:
 *   get:
 *     summary: Récupère les statistiques d'un cours
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cours
 *       - in: query
 *         name: academicYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d{4}-\d{4}$
 *         description: Année académique
 *     responses:
 *       200:
 *         description: Statistiques du cours
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseStats'
 *
 * /stats/student/{studentId}:
 *   get:
 *     summary: Récupère les statistiques par semestre d'un étudiant
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'étudiant
 *       - in: query
 *         name: academicYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d{4}-\d{4}$
 *         description: Année académique
 *     responses:
 *       200:
 *         description: Statistiques par semestre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SemesterStats'
 */

import { Router } from 'express';
import { statsController } from '../controllers/statsController';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const academicYearSchema = z.object({
  academicYear: z.string().regex(/^\d{4}-\d{4}$/),
});

router.get(
  '/global',
  validate(academicYearSchema),
  statsController.getGlobalStats
);
router.get(
  '/course/:courseId',
  validate(academicYearSchema),
  statsController.getCourseStats
);
router.get(
  '/student/:studentId',
  validate(academicYearSchema),
  statsController.getStudentSemesterStats
);

export const statsRoutes = router;
