import {PDFService} from '../pdfService';
import PDFDocument from 'pdfkit';
import pdf from 'pdf-parse';


describe('PDFService', () => {
    const studentInfo = {
        firstName: 'John',
        lastName: 'Doe',
        studentId: '123456',
        academicYear: '2023-2024',
    };

    const grades = [
        {
            courseCode: 'CS101',
            courseName: 'Computer Science 101',
            credits: 5,
            grade: 15,
            semester: '1',
        },
        {
            courseCode: 'MA101',
            courseName: 'Mathematics 101',
            credits: 5,
            grade: 12,
            semester: '1',
        },
        {
            courseCode: 'PH101',
            courseName: 'Physics 101',
            credits: 5,
            grade: 8,
            semester: '2',
        },
    ];

    it('should organize grades by semester correctly', () => {
        const organized = PDFService['organizeBySemester'](grades);
        expect(organized).toEqual([
            {
                semester: '1',
                grades: [
                    {courseCode: 'CS101', courseName: 'Computer Science 101', credits: 5, grade: 15, semester: '1'},
                    {courseCode: 'MA101', courseName: 'Mathematics 101', credits: 5, grade: 12, semester: '1'},
                ],
                average: 13.5,
                totalCredits: 10,
                validatedCredits: 10,
            },
            {
                semester: '2',
                grades: [
                    {courseCode: 'PH101', courseName: 'Physics 101', credits: 5, grade: 8, semester: '2'},
                ],
                average: 8,
                totalCredits: 5,
                validatedCredits: 0,
            },
        ]);
    });

    it('should generate a transcript PDF', async () => {
        const buffer = await PDFService.generateTranscript(studentInfo, grades);
        expect(buffer).toBeInstanceOf(Buffer);
        const data = await pdf(buffer);
        expect(data.text).toContain('IUT de Laval');
        expect(data.text).toContain('Relevé de notes');
        expect(data.text).toContain('John Doe');
        expect(data.text).toContain('123456');
        expect(data.text).toContain('2023-2024');
        expect(data.text).toContain('CS101');
        expect(data.text).toContain('Computer Science 101');
        expect(data.text).toContain('Moyenne du semestre: 13.50');
        expect(data.text).toContain('Moyenne du semestre: 8.00');
        expect(data.text).toContain('Fait à Laval, le');
        expect(data.text).toContain('15.00');
    });
    it('should handle errors during PDF generation', async () => {
        jest.mock('pdfkit', () => {
            const mPDFDocument = {
                fontSize: jest.fn().mockReturnThis(),
                text: jest.fn().mockReturnThis(),
                moveDown: jest.fn().mockReturnThis(),
                end: jest.fn(),
                pipe: jest.fn(),
            };
            return jest.fn(() => mPDFDocument);
        });
        jest.spyOn(PDFDocument.prototype, 'end').mockImplementationOnce(() => {
            throw new Error('PDF generation error');
        });

        await expect(PDFService.generateTranscript(studentInfo, grades)).rejects.toThrow('PDF generation error');
    });
});