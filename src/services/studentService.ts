// src/services/studentService.ts
import { PrismaClient, Student, UserType, Enrollment } from '@prisma/client';
import { authService } from './authService';

const prisma = new PrismaClient();

export interface RegisterStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: Date;
  gender?: string;
  currentSchool?: string;
  currentGrade?: string;
  parentId?: string;
}

export interface EnrollStudentDto {
  studentId: string;
  programId: string;
  schedule?: string;
  learningGoals?: string;
}

export class StudentService {
  async registerStudent(studentData: RegisterStudentDto): Promise<Student> {
    // First register the user
    const { user } = await authService.register({
      email: studentData.email,
      password: studentData.password,
      userType: UserType.STUDENT,
    });

    // Then create the student profile
    const student = await prisma.student.create({
      data: {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        dateOfBirth: studentData.dateOfBirth,
        gender: studentData.gender,
        currentSchool: studentData.currentSchool,
        currentGrade: studentData.currentGrade,
        userId: user.id,
        parentId: studentData.parentId,
      },
    });

    return student;
  }

  async getStudentByUserId(userId: string): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { userId },
      include: {
        parent: true,
        enrollments: {
          include: {
            program: true,
          },
        },
      },
    });
  }

  async getStudentById(studentId: string): Promise<Student | null> {
    return prisma.student.findUnique({
      where: { id: studentId },
      include: {
        parent: true,
        enrollments: {
          include: {
            program: true,
          },
        },
      },
    });
  }

  async updateStudent(studentId: string, data: Partial<Student>): Promise<Student> {
    return prisma.student.update({
      where: { id: studentId },
      data,
    });
  }

  async enrollInProgram(enrollmentData: EnrollStudentDto): Promise<Enrollment> {
    return prisma.enrollment.create({
      data: {
        studentId: enrollmentData.studentId,
        programId: enrollmentData.programId,
        schedule: enrollmentData.schedule,
        learningGoals: enrollmentData.learningGoals,
      },
    });
  }

  async getStudentEnrollments(studentId: string) {
    return prisma.enrollment.findMany({
      where: { studentId },
      include: {
        program: true,
      },
    });
  }
}

export const studentService = new StudentService();