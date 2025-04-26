// src/routes/parentRoutes.ts
import express from 'express';
import { parentController } from '../controllers/parentController';
import { authenticate, authorize } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation middleware
const parentRegisterValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

const parentUpdateValidation = [
  body('firstName').optional(),
  body('lastName').optional(),
  body('phoneNumber').optional(),
  body('address').optional(),
  validate,
];

const addChildValidation = [
  body('childId').notEmpty().withMessage('Child ID is required'),
  body('relationToStudent').optional(),
  validate,
];

// Parent routes
router.post('/register', parentRegisterValidation, parentController.registerParent);
router.get('/profile', authenticate, authorize(['PARENT']), parentController.getParentProfile);
router.put('/', authenticate, authorize(['PARENT']), parentUpdateValidation, parentController.updateParent);
router.post('/add-child', authenticate, authorize(['PARENT']), addChildValidation, parentController.addChildToParent);
router.get('/children', authenticate, authorize(['PARENT']), parentController.getParentChildren);

export default router;