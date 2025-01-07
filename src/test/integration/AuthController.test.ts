import app from "../../app";
import request from "supertest";
import {setupDatabase} from "../../scripts/dbSetup";
import {pool} from "../../config/database";

describe('GET /auth/login', () => {
    beforeAll(async () => {
        await setupDatabase();
    });
    afterAll(async () => {
        await pool.end();
    });

    it('should return 400 OK (no data send)', async () => {
        const response = await request(app).post('/api/auth/login');
        expect(response.status).toBe(400);
    });

    it('should return 401 Unauthorized (wrong email)', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({email: 'toto@test.com', password: 'password123'});
        expect(response.status).toBe(401);
        expect(response.body).toEqual({error: 'Email ou mot de passe incorrect'});
    });
    it('should return 401 Unauthorized (wrong password)', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({email: 'prof@example.com', password: 'testInvalid'});
        expect(response.status).toBe(401);
        expect(response.body).toEqual({error: 'Email ou mot de passe incorrect'});
    });

    it('should return 200 (valid)', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({email: 'prof@example.com', password: 'password123'});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
})

describe("Auth Middleware - Token validation", () => {

    it('should return Token missing', async () => {
        const response = await request(app)
            .get('/api/courses')
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Token manquant");
    });

    it('should return Token invalide', async () => {
        const response = await request(app)
            .get('/api/courses')
            .set('Authorization', `Bearer INVALID_TOKEN`);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Token invalide");
    });
});