import express from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import passport from 'passport';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { Request, Response, NextFunction } from 'express';
// import { ParsedQs } from 'qs';
import { GoogleRequest } from '../controllers/authController';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('userType').isIn(['STUDENT', 'PARENT', 'SCHOOL']).withMessage('Invalid user type'),
  validate,
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Auth routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', authenticate, (req: Request, res: Response, next: NextFunction) => {
  // Type cast only at the usage point
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authController.getMe(req as any, res).catch(next);
});
router.get(
  '/google',
  (req, res, next) => {
    // Store userType in session for later use
    if (req.query.userType) {
      req.session = req.session || {};
      req.session.userType = String(req.query.userType); 
    }
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
// router.get(
//   '/google',
//   (req, res, next) => {
//     // Store userType in session for later use
//     if (req.query.userType && typeof req.query.userType === 'string') {
//       req.session = req.session || {};
//       req.session.userType = req.query.userType;
//     }
//     next();
//   },
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// Google OAuth routes
// router.get(
//   '/google',
//   (req, res, next) => {
//     // Store userType in session for later use
//     if (req.query.userType) {
//       req.session = req.session || {};
//       req.session.userType = req.query.userType;
//     }
//     next();
//   },
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// router.get(
  // '/google',
  // (req: Request, res: Response, next: NextFunction) => {
  //   if (req.query.userType) {
  //     req.session = req.session || {};
  //     req.session.userType = req.query.userType as string;
  //   }
  //   next();
  // },
//   (req: Request<Record<string, never>, Record<string, never>, { userType?: string }, ParsedQs>, res: Response, next: NextFunction) => {
//     if (req.session?.userType) {
//       req.body.userType = req.session.userType;
//     }
//     next();
//   },
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );



router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (
    req: Request<Record<string, never>, unknown, { userType?: string }>,
    res: Response,
    next: NextFunction
  ) => {
    if (req.session?.userType) {
      req.body.userType = req.session.userType;
    }
    next();
  },
  (req, res) => authController.googleAuthCallback(req as GoogleRequest, res)
);
export default router;

