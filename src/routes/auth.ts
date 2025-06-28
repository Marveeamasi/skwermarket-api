import { Router } from 'express';
import { register, verifyOTP, login, forgotPassword, resetPassword } from '../controllers/authController';
import { rateLimiter } from '../middlewares/rateLimiterMiddleware';

const router = Router();

router.post('/register', rateLimiter, register);
router.post('/verify-otp', rateLimiter, verifyOTP);
router.post('/login', rateLimiter, login);
router.post('/forgot-password', rateLimiter, forgotPassword);
router.post('/reset-password', rateLimiter, resetPassword);

export default router;