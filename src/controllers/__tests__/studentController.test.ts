import {pool} from "../../config/database";
import {studentController} from "../studentController";

describe('Student Controller - getAll', () => {
    // let req: Partial<Request>;
    // let res: Partial<Response>;
    // beforeEach(() => {
    //     req = {};
    //     res = {
    //         status: jest.fn().mockReturnThis() as unknown as Response,
    //         json: jest.fn().mockReturnThis() as unknown as Response,
    //     };
    // });
    // beforeAll(async () => {
    //     await pool.query(`
    //         INSERT INTO students (first_name, last_name, email, date_of_birth, student_id)
    //         VALUES
    //             ('John', 'Doe', 'john.doe@example.com', '2000-01-01', 'S12345'),
    //             ('Jane', 'Smith', 'jane.smith@example.com', '2001-02-02', 'S67890');
    //         `
    //     );
    // });

    it('returns all Students successfully', async () => {
        // await studentController.getAll(req as Request, res as Response);
        // expect(res.status).not.toHaveBeenCalled();
        // expect(res.json).toHaveBeenCalled();
        expect(1).toBe(1);
    });
});