import app from "../../app";
import request from "supertest";
import {setupDatabase} from "../../scripts/dbSetup";
import {pool} from "../../config/database";

let authToken: string;
beforeAll(async () => {

    await setupDatabase();

//     Get Valid Authtoken
    const authResponse = await request(app)
        .post('/api/auth/login')
        .send({email: 'prof@example.com', password: 'password123'});
    authToken = authResponse.body.token;
});

afterAll(async () => {
    await pool.end();
});


describe('GET /api/courses', () => {
    it('should return 200 and a list of courses', async () => {
        const response = await request(app)
            .get('/api/courses')
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('should return Token missing', async () => {
        const response = await request(app)
            .get('/api/courses')
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Token manquant");
    });

    // it('should return 404 for a non-existent course', async () => {
    //     const response = await request(app)
    //         .get('/api/courses/999')
    //         .set('Authorization', `Bearer ${authToken}`)
    //         .catch(res => {
    //             expect(res.status).toBe(404);
    //         });
    //     // expect(response.status).toBe(404);
    //     // expect(response.body).toEqual({error: 'Course not found'});
    // });
});

// describe('POST /api/courses', () => {
//     it('should create a new course and return 201', async () => {
//         const newCourse = {name: 'New Course', description: 'Course Description'};
//         const response = await request(app)
//             .post('/api/courses')
//             .set('Authorization', `Bearer ${authToken}`)
//             .send(newCourse);
//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty('id');
//         expect(response.body.name).toBe(newCourse.name);
//     });
// });

// describe('PUT /api/courses/:id', () => {
//     it('should update an existing course and return 200', async () => {
//         const randomCode = 'CS' + Math.random();
//         const newCourse = { code: randomCode, name: 'New Course', credits: 3, description: 'Course Description' };
//         console.log(newCourse);
//         const createResponse = await request(app)
//             .post('/api/courses')
//             .set('Authorization', `Bearer ${authToken}`)
//             .send(newCourse);
//         const courseId = createResponse.body.id;
//
//         const updatedCourse = {name: 'Updated Course', description: 'Updated Description'};
//         const response = await request(app)
//             .put(`/api/courses/${courseId}`)
//             .set('Authorization', `Bearer ${authToken}`)
//             .send(updatedCourse);
//         expect(response.status).toBe(200);
//         expect(response.body.name).toBe(updatedCourse.name);
//     });
// });

describe('DELETE /api/courses/:id', () => {
    it('should delete an existing course and return 204', async () => {
        const newCourse = {code: 'CS101', name: 'New Course', credits: 3, description: 'Course Description'};
        const createResponse = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newCourse);
        const courseId = createResponse.body.id;

        const deleteResponse = await request(app)
            .delete(`/api/courses/${courseId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(deleteResponse.status).toBe(204);
    });
});


const createCourse = async (authToken: string) => {
    const newCourse = {
        code: Math.random().toString(36).substring(2, 8),
        name: 'New Course',
        credits: 3,
        description: 'Course Description'
    };
    const createResponse = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newCourse);
    return createResponse.body.id;
};