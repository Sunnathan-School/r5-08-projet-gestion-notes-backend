import { z } from 'zod';

export const createCourseSchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(2).max(255),
  credits: z.number().int().min(1).max(60),
  description: z.string().optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
