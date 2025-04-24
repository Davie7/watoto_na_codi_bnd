import express from 'express';
import { schoolController } from '../controllers/schoolController';
import { authenticate, authorize } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation middleware
const schoolRegisterValidation = [
  body('name').notEmpty().withMessage('School name is required'),
  body('adminName').notEmpty().withMessage('Admin name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

const schoolUpdateValidation = [
  body('name').optional(),
  body('adminName').optional(),
  body('certificate').optional(),
  validate,
];

// School routes
router.post('/register', schoolRegisterValidation, schoolController.registerSchool);
router.get('/profile', authenticate, authorize(['SCHOOL']), schoolController.getSchoolProfile);
router.get('/', schoolController.getAllSchools);
router.put('/', authenticate, authorize(['SCHOOL']), schoolUpdateValidation, schoolController.updateSchool);

export default router;