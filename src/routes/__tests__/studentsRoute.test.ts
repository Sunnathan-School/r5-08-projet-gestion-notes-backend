import request from 'supertest';
import app from '../../app';
import { studentController } from '../../controllers/studentController';
import { authMiddleware } from '../../middleware/auth';

jest.mock('../../controllers/studentController');
jest.mock('../../middleware/auth');

describe('Student Routes', () => {
    beforeEach(() => {
        const mockAuthMiddleware = authMiddleware as jest.Mock;
        mockAuthMiddleware.mockImplementation((req, res, next) => {
            req.user = { id: 1, email: 'test@example.com', role: 'professor' };
            next();
        });
    });

    it('should get all students', async () => {
        const mockGetAll = studentController.getAll as jest.Mock;
        mockGetAll.mockImplementation((req, res) => res.status(200).json([]));

        await request(app)
            .get('/api/students')
            .set('Authorization', 'Bearer valid_token')
            .expect(200);

        expect(mockGetAll).toHaveBeenCalled();
    });

    it('should get a student by id', async () => {
        const mockGetById = studentController.getById as jest.Mock;
        mockGetById.mockImplementation((req, res) => res.status(200).json({}));

        await request(app)
            .get('/api/students/1')
            .set('Authorization', 'Bearer valid_token')
            .expect(200);

        expect(mockGetById).toHaveBeenCalled();
    });

    it('should create a new student', async () => {
        const mockCreate = studentController.create as jest.Mock;
        mockCreate.mockImplementation((req, res) => res.status(201).json({}));

        await request(app)
            .post('/api/students')
            .set('Authorization', 'Bearer valid_token')
            .send({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', dateOfBirth: '2000-01-01', studentId: '12345' })
            .expect(201);

        expect(mockCreate).toHaveBeenCalled();
    });
});