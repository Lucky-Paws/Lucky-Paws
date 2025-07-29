import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { authValidation } from '../utils/validation';

const router = Router();

router.post('/signup', validate(authValidation.signup), authController.signup);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/social-login', authController.socialLogin);
router.post('/complete-social-signup', authController.completeSocialSignup);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);

export default router;