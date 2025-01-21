import request from 'supertest';
import {authController} from "../../controllers/authController";
import app from "../../app";

jest.mock('../../controllers/authController');

describe('Auth Routes', () => {
    it('calls the login controller for POST /api/auth/login', async () => {
        const mockLogin = authController.login as jest.Mock;
        mockLogin.mockImplementation((req, res) => res.status(200).json({}));

        await request(app)
            .post('/api/auth/login')
            .send({ email: 'professor@example.com', password: 'password123' })
            .expect(200);

        expect(mockLogin).toHaveBeenCalled();
    });
});
