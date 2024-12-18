import request from 'supertest';
import app from '../../app';
import { gradeController } from '../../controllers/gradeController';
import { authMiddleware } from '../../middleware/auth';

jest.mock('../../controllers/gradeController');
jest.mock('../../middleware/auth');

describe('Grade Routes', () => {
    beforeEach(() => {
        const mockAuthMiddleware = authMiddleware as jest.Mock;
        mockAuthMiddleware.mockImplementation((req, res, next) => {
            req.user = { id: 1, email: 'test@example.com', role: 'professor' };
            next();
        });
    });

    it('should get all grades', async () => {
        const mockGetAll = gradeController.getAll as jest.Mock;
        mockGetAll.mockImplementation((req, res) => res.status(200).json([]));

        await request(app)
            .get('/api/grades')
            .set('Authorization', 'Bearer valid_token')
            .expect(200);

        expect(mockGetAll).toHaveBeenCalled();
    });

    it('should get grades by student id', async () => {
        const mockGetByStudent = gradeController.getByStudent as jest.Mock;
        mockGetByStudent.mockImplementation((req, res) => res.status(200).json([]));

        await request(app)
            .get('/api/grades/student/1')
            .set('Authorization', 'Bearer valid_token')
            .expect(200);

        expect(mockGetByStudent).toHaveBeenCalled();
    });

    it('should create a new grade', async () => {
        const mockCreate = gradeController.create as jest.Mock;
        mockCreate.mockImplementation((req, res) => res.status(201).json({}));

        await request(app)
            .post('/api/grades')
            .set('Authorization', 'Bearer valid_token')
            .send({ studentId: 1, courseId: 1, grade: 15, semester: 'S1', academicYear: '2023-2024' })
            .expect(201);

        expect(mockCreate).toHaveBeenCalled();
    });

    it('should update a grade', async () => {
        const mockUpdate = gradeController.update as jest.Mock;
        mockUpdate.mockImplementation((req, res) => res.status(200).json({}));

        await request(app)
            .put('/api/grades/1')
            .set('Authorization', 'Bearer valid_token')
            .send({ grade: 18 })
            .expect(200);

        expect(mockUpdate).toHaveBeenCalled();
    });

    it('should delete a grade', async () => {
        const mockDelete = gradeController.delete as jest.Mock;
        mockDelete.mockImplementation((req, res) => res.status(204).send());

        await request(app)
            .delete('/api/grades/1')
            .set('Authorization', 'Bearer valid_token')
            .expect(204);

        expect(mockDelete).toHaveBeenCalled();
    });

    it('should generate transcript for a student', async () => {
        const mockGenerateTranscript = gradeController.generateTranscript as jest.Mock;
        mockGenerateTranscript.mockImplementation((req, res) => res.status(200).send('PDF content'));

        await request(app)
            .get('/api/grades/student/1/transcript')
            .set('Authorization', 'Bearer valid_token')
            .query({ academicYear: '2023-2024' })
            .expect(200);

        expect(mockGenerateTranscript).toHaveBeenCalled();
    });
});