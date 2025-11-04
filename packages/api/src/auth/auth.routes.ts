import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../presentation/middleware/auth';

/**
 * Authentication routes
 */
export function createAuthRoutes(authController?: AuthController): Router {
    const router = Router();
    const controller = authController || new AuthController();

    // Bind methods to preserve 'this' context
    const signUp = controller.signUp.bind(controller);
    const login = controller.login.bind(controller);
    const verifyToken = controller.verifyToken.bind(controller);
    const verifyEmail = controller.verifyEmail.bind(controller);
    const forgotPassword = controller.forgotPassword.bind(controller);
    const resetPassword = controller.resetPassword.bind(controller);
    const getMe = controller.getMe.bind(controller);

    // Public routes
    router.get('/verify', verifyEmail);
    router.post('/signup', signUp);
    router.post('/login', login);
    router.post('/verify-token', verifyToken);
    router.post('/forgot-password', forgotPassword);
    router.post('/reset-password', resetPassword);

    // Protected routes
    router.get('/me', authMiddleware, getMe);

    return router;
}

// Export individual route handlers for testing
export { AuthController };
