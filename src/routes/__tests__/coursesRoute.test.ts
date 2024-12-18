import request from 'supertest';
import app from '../../app';
import { courseController } from '../../controllers/courseController';
import { authMiddleware } from '../../middleware/auth';

jest.mock('../../controllers/courseController');
jest.mock('../../middleware/auth');

describe('Course Routes', () => {
    beforeEach(() => {
        const mockAuthMiddleware = authMiddleware as jest.Mock;
        mockAuthMiddleware.mockImplementation((req, res, next) => {
            req.user = { id: 1, email: 'test@example.com', role: 'professor' };
            next();
        });
    });

    it('should get all courses', async () => {
        const mockGetAll = courseController.getAll as jest.Mock;
        mockGetAll.mockImplementation((req, res) => res.status(200).json([]));

        await request(app)
            .get('/api/courses')
            .set('Authorization', 'Bearer valid_token')
            .expect(200);

        expect(mockGetAll).toHaveBeenCalled();
    });

    it('should get a course by id', async () => {
        const mockGetById = courseController.getById as jest.Mock;
        mockGetById.mockImplementation((req, res) => res.status(200).json({}));

        await request(app)
            .get('/api/courses/1')
            .set('Authorization', 'Bearer valid_token')
            .expect(200);

        expect(mockGetById).toHaveBeenCalled();
    });

    it('should create a new course', async () => {
        const mockCreate = courseController.create as jest.Mock;
        mockCreate.mockImplementation((req, res) => res.status(201).json({}));

        await request(app)
            .post('/api/courses')
            .set('Authorization', 'Bearer valid_token')
            .send({ code: 'CS101', name: 'Computer Science', credits: 3 })
            .expect(201);

        expect(mockCreate).toHaveBeenCalled();
    });

    it('should update a course', async () => {
        const mockUpdate = courseController.update as jest.Mock;
        mockUpdate.mockImplementation((req, res) => res.status(200).json({}));

        await request(app)
            .put('/api/courses/1')
            .set('Authorization', 'Bearer valid_token')
            .send({ code: 'CS101', name: 'Computer Science', credits: 3 })
            .expect(200);

        expect(mockUpdate).toHaveBeenCalled();
    });

    it('should delete a course', async () => {
        const mockDelete = courseController.delete as jest.Mock;
        mockDelete.mockImplementation((req, res) => res.status(204).send());

        await request(app)
            .delete('/api/courses/1')
            .set('Authorization', 'Bearer valid_token')
            .expect(204);

        expect(mockDelete).toHaveBeenCalled();
    });
});