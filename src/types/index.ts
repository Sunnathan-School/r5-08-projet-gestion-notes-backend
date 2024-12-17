export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  studentId: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  description: string;
}

export interface Grade {
  id: number;
  studentId: number;
  courseId: number;
  grade: number;
  semester: string;
  academicYear: string;
}

export interface Professor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}
