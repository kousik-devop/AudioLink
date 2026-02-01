import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as validationRules from '../middlewares/validation.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import passport from 'passport';

const router = express.Router();

// Sample route for health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'Auth service is healthy' });
});

router.post('/register', validationRules.registerUserValidationRules, authController.register);
router.post('/login', validationRules.loginUserValidationRules, authController.login);
router.get('/current-user', authMiddleware, authController.getCurrentUser);
router.post('/logout',authMiddleware, authController.logout);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),

);

// Callback route that Google will redirect to after authentication
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleAuthCallback
);

export default router;