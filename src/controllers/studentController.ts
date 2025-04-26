// src/controllers/studentController.ts
import { Request, Response } from 'express';
import { studentService, RegisterStudentDto, EnrollStudentDto } from '../services/studentService';
import { AuthenticatedRequest } from '../middleware/auth';

export class StudentController {
  async registerStudent(req: Request, res: Response): Promise<void> {
    try {
      const studentData: RegisterStudentDto = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
        gender: req.body.gender,
        currentSchool: req.body.currentSchool,
        currentGrade: req.body.currentGrade,
        parentId: req.body.parentId,
      };

      const student = await studentService.registerStudent(studentData);

      res.status(201).json({
        success: true,
        data: { student },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async getStudentProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req as AuthenticatedRequest;
      const student = await studentService.getStudentByUserId(userId);

      if (!student) {
        throw new Error('Student profile not found');
      }

      res.status(200).json({
        success: true,
        data: { student },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async updateStudent(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req as AuthenticatedRequest;
      const student = await studentService.getStudentByUserId(userId);

      if (!student) {
        throw new Error('Student profile not found');
      }

      const updatedStudent = await studentService.updateStudent(student.id, req.body);

      res.status(200).json({
        success: true,
        data: { student: updatedStudent },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async enrollInProgram(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req as AuthenticatedRequest;
      const student = await studentService.getStudentByUserId(userId);

      if (!student) {
        throw new Error('Student profile not found');
      }

      const enrollmentData: EnrollStudentDto = {
        studentId: student.id,
        programId: req.body.programId,
        schedule: req.body.schedule,
        learningGoals: req.body.learningGoals,
      };

      const enrollment = await studentService.enrollInProgram(enrollmentData);

      res.status(201).json({
        success: true,
        data: { enrollment },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async getStudentEnrollments(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req as AuthenticatedRequest;
      const student = await studentService.getStudentByUserId(userId);

      if (!student) {
        throw new Error('Student profile not found');
      }

      const enrollments = await studentService.getStudentEnrollments(student.id);

      res.status(200).json({
        success: true,
        data: { enrollments },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }
}

export const studentController = new StudentController();