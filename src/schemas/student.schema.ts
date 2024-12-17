import { z } from 'zod';

export const createStudentSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email().max(255),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  studentId: z.string().min(3).max(50),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
