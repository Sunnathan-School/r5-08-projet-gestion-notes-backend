import request from 'supertest';
import app from '../../app';
import { statsController } from '../../controllers/statsController';
import { authMiddleware } from '../../middleware/auth';

jest.mock('../../controllers/statsController');
jest.mock('../../middleware/auth');

describe('Stats Routes', () => {
    beforeEach(() => {
        const mockAuthMiddleware = authMiddleware as jest.Mock;
        mockAuthMiddleware.mockImplementation((req, res, next) => {
            req.user = { id: 1, email: 'test@example.com', role: 'professor' };
            next();
        });
    });

    it('should get global stats', async () => {
        const mockGetGlobalStats = statsController.getGlobalStats as jest.Mock;
        mockGetGlobalStats.mockImplementation((req, res) => res.status(200).json({}));

        await request(app)
            .get('/api/stats/global')
            .set('Authorization', 'Bearer valid_token')
            .query({ academicYear: '2023-2024' })
            .expect(200);

        expect(mockGetGlobalStats).toHaveBeenCalled();
    });

    it('should get course stats', async () => {
        const mockGetCourseStats = statsController.getCourseStats as jest.Mock;
        mockGetCourseStats.mockImplementation((req, res) => res.status(200).json({}));

        await request(app)
            .get('/api/stats/course/1')
            .set('Authorization', 'Bearer valid_token')
            .query({ academicYear: '2023-2024' })
            .expect(200);

        expect(mockGetCourseStats).toHaveBeenCalled();
    });

    it('should get student semester stats', async () => {
        const mockGetStudentSemesterStats = statsController.getStudentSemesterStats as jest.Mock;
        mockGetStudentSemesterStats.mockImplementation((req, res) => res.status(200).json([]));

        await request(app)
            .get('/api/stats/student/1')
            .set('Authorization', 'Bearer valid_token')
            .query({ academicYear: '2023-2024' })
            .expect(200);

        expect(mockGetStudentSemesterStats).toHaveBeenCalled();
    });
});