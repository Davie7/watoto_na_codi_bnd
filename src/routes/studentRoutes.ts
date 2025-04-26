// src/routes/studentRoutes.ts
import express from 'express';
import { studentController } from '../controllers/studentController';
import { authenticate, authorize } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation middleware
const studentRegisterValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  validate,
];

const studentUpdateValidation = [
  body('firstName').optional(),
  body('lastName').optional(),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('gender').optional(),
  body('currentSchool').optional(),
  body('currentGrade').optional(),
  validate,
];

const enrollmentValidation = [
  body('programId').notEmpty().withMessage('Program ID is required'),
  body('schedule').optional(),
  body('learningGoals').optional(),
  validate,
];

// Student routes
router.post('/register', studentRegisterValidation, studentController.registerStudent);
router.get('/profile', authenticate, authorize(['STUDENT']), studentController.getStudentProfile);
router.put('/', authenticate, authorize(['STUDENT']), studentUpdateValidation, studentController.updateStudent);
router.post('/enroll', authenticate, authorize(['STUDENT']), enrollmentValidation, studentController.enrollInProgram);
router.get('/enrollments', authenticate, authorize(['STUDENT']), studentController.getStudentEnrollments);

export default router;